import { ConnectionPostgresOptions } from "./connection_postgres_options.ts";
import { stringify } from "../../builders/base/sql.ts";
import { IConnectionOperations } from "../../iconnection_operations.ts";
import { SpiCreateSchema } from "../../executors/types/spi_create_schema.ts";
import { SpiDropSchema } from "../../executors/types/spi_drop_schema.ts";
import { SpiAllColumnDefinition } from "../../executors/types/spi_all_column_definition.ts";
import { SpiColumnDefinition } from "../../executors/types/spi_column_definition.ts";
import { SpiColumnAdjust } from "../../executors/types/spi_column_adjust.ts";
import { SpiColumnComment } from "../../executors/types/spi_column_comment.ts";
import { initConnection } from "./connection_postgres_pool.ts";
import { filterConnectionProps } from "../../connection_operations.ts";
import { MetadataStore } from "../../../decorators/metadata/metadata_store.ts";
import { EntityOptions } from "../../../decorators/options/entity_options.ts";
import { ColumnOptions } from "../../../decorators/options/column_options.ts";
import { ColumnType } from "../../../decorators/options/column_type.ts";
import { postgres } from "../../../../deps.ts";
import { KEY_CONFIG } from "./connection_postgres_variables.ts";
import { ExecuteResult, Query } from "../../execute_result.ts";

class ConnectionPostgres implements IConnectionOperations {
  #currentDatabase?: string;
  #currentSchema?: string;
  delimiters: [string, string?] = [`"`];

  /**
   * Connection Options
   */

  constructor(public options: ConnectionPostgresOptions) {}
  /* Basic Connection Operations*/
  createSchema = (sds: SpiCreateSchema): string => {
    /**
     * Create schema
     */
    const { schema, check } = sds;
    const sql = `CREATE SCHEMA ${check ? "IF NOT EXISTS " : ""}${schema}`;
    return sql;
  };

  dropSchema = (sds: SpiDropSchema): string => {
    /**
     * Droping schema
     */
    const { schema, check } = sds;
    const sql = `DROP SCHEMA ${check ? "IF EXISTS " : ""}${schema}`;
    return sql;
  };

  columnDefinition = (scd: SpiAllColumnDefinition): string => {
    /**
     * Column definition
     */
    const defs: string[] = [];
    defs.push(scd.columnName);
    const ctype = this.getDbColumnType(scd).toUpperCase();
    defs.push(ctype);

    if (scd.autoIncrement === "uuid" && ctype.toLowerCase() === "uuid") {
      defs.push("DEFAULT gen_random_uuid()");
    } else if (
      scd.autoIncrement === "uuid" &&
      ["text", "varchar"].includes(scd.spitype || "")
    ) {
      defs.push("DEFAULT gen_random_uuid()::text");
    } else if (!scd.autoIncrement && "default" in scd) {
      defs.push(`DEFAULT ${stringify(scd.default)}`);
    }

    if (scd.primary) {
      defs.push(`PRIMARY KEY`);
    } else {
      if (scd.nullable === false) {
        defs.push(`NOT NULL`);
      }
    }

    return defs.join(" ");
  };

  columnAlter = (
    from: { schema?: string; entity: string; columnName: string },
    changes: SpiColumnAdjust | SpiColumnDefinition,
  ): string[] => {
    const { schema, entity, columnName } = from;
    const querys: string[] = [];
    const efrom = `${schema ? schema + "." : ""}${entity}`;
    if (!columnName && !changes.columnName) {
      return querys;
    }
    let fcolumnName = columnName;
    if (columnName && changes.columnName && columnName != changes.columnName) {
      querys.push(
        `ALTER TABLE ${efrom} RENAME COLUMN ${columnName} TO ${changes.columnName}`,
      );
      fcolumnName = changes.columnName;
    }
    if (!columnName && changes.columnName) {
      /**
       * New column
       */
      let aquery = `ALTER TABLE ${efrom} ADD COLUMN ${changes.columnName} ${
        this.getDbColumnType(changes).toUpperCase()
      }`;
      if ("nullable" in changes) {
        aquery += (changes.nullable ? "" : " NOT") + " NULL";
      }
      if ("default" in changes) {
        aquery += (" DEFAULT " + stringify(changes.default));
      }
      querys.push(aquery);
      fcolumnName = changes.columnName;
    } else {
      /**
       * Alter column
       */
      if (changes.spitype) {
        const ntype = this.getDbColumnType(changes);
        let tquery =
          `ALTER TABLE ${efrom} ALTER COLUMN ${fcolumnName} TYPE ${ntype.toUpperCase()}`;
        if (["numeric"].includes(changes.spitype)) {
          tquery += ` USING (${fcolumnName})::${ntype}`;
        } else if (["boolean"].includes(changes.spitype)) {
          tquery += ` USING (${fcolumnName})::int::${ntype}`;
        } else if (["timestamp"].includes(changes.spitype)) {
          tquery += ` USING (${fcolumnName})::timestamp without time zone`;
        } else if (["bytearray"].includes(changes.spitype)) {
          tquery += ` USING (${fcolumnName})::bytea`;
        }
        querys.push(tquery);
      }
      if ("nullable" in changes) {
        querys.push(
          `ALTER TABLE ${efrom} ALTER COLUMN ${fcolumnName} ${
            changes.nullable ? "DROP" : "SET"
          } NOT NULL`,
        );
      }
      if ("default" in changes) {
        querys.push(
          `ALTER TABLE ${efrom} ALTER COLUMN ${fcolumnName} ${
            changes.default
              ? "SET DEFAULT " + stringify(changes.default)
              : "DROP DEFAULT"
          }`,
        );
      }
    }
    return querys;
  };

  columnComment = (scc: SpiColumnComment): string => {
    const { schema, entity, columnName, comment } = scc;
    let sql = `COMMENT ON COLUMN ${
      schema ? schema + "." : ""
    }${entity}.${columnName} IS `;
    sql += `${
      comment === null || comment === undefined ? "NULL" : stringify(comment)
    }`;
    return sql;
  };

  async test(): Promise<boolean> {
    const driverConf = filterConnectionProps(KEY_CONFIG, this.options);
    try {
      const pool = (initConnection(driverConf) as postgres.Pool);
      const client = await pool.connect();
      // const query = this.getQuery()
      client.release();
      await pool.end();
      return true;
    } catch (err) {
      return false;
    }
  }

  async checkSchema(req: { name: string }): Promise<{
    name: string;
    database?: string;
    exists: boolean;
    oid?: number;
    dbdata?: any;
    type?: string;
  }> {
    req.name = req.name.replace(/'/ig, "''");
    let res: {
      name: string;
      database?: string;
      exists: boolean;
      oid?: number;
      dbdata?: any;
      type?: string;
    } = {
      name: req.name,
      exists: false,
    };
    const query = `
SELECT catalog_name "database"
    , schema_name "schema"
    , schema_owner "owner"
    , default_character_set_catalog
    , default_character_set_schema
    , default_character_set_name
    , sql_path
FROM information_schema.schemata
WHERE schema_name NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
  AND schema_name = '${req.name}' 
    `;
    const result = await this.execute(query);
    const rows = result.rows || [];
    if (rows.length) {
      res = {
        name: rows[0].schema,
        database: rows[0].database,
        exists: true,
        // oid: rows[0].oid,
        dbdata: rows[0],
        type: "schema",
      };
      return res;
    }
    return res;
  }

  async checkObject(
    req: {
      name: string;
      type?:
        | "table"
        | "index"
        | "sequence"
        | "toast table"
        | "view"
        | "materialized view"
        | "type"
        | "foreign table"
        | "partitioned table"
        | "partitioned index";
      schema?: string;
      database?: string;
    },
  ): Promise<
    {
      name: string;
      schema?: string;
      database?: string;
      exists: boolean;
      oid?: number;
      dbdata?: any;
      type?: string;
    }
  > {
    req.name = req.name.replace(/'/ig, "''");
    req.schema = (req.schema || "").replace(/'/ig, "''");
    let res: {
      name: string;
      schema?: string;
      database?: string;
      exists: boolean;
      oid?: number;
      dbdata?: any;
      type?: string;
    } = {
      name: req.name,
      schema: req.schema,
      database: req.database,
      exists: false,
    };
    /**
     * TODO
     * buscar el schema por defecto en el query
     */
    const query = `
SELECT * FROM (
  SELECT n."oid"
      , current_database() "database"
      , n."nspname" "schema"
      , c."relname" "name"
      , CASE c."relkind" WHEN 'r' THEN 'table'
                          WHEN 'i' THEN 'index'
                          WHEN 'S' THEN 'sequence'
                          WHEN 't' THEN 'toast table'
                          WHEN 'v' THEN 'view'
                          WHEN 'm' THEN 'materialized view'
                          WHEN 'c' THEN 'type'
                          WHEN 'f' THEN 'foreign table'
                          WHEN 'p' THEN 'partitioned table'
                          WHEN 'I' THEN 'partitioned index'
        END "type"
  FROM pg_catalog.pg_class c
  INNER JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname not in ('pg_catalog', 'information_schema', 'pg_toast')
    AND n.nspname = CASE WHEN '${req.schema}' = '' THEN current_schema() ELSE '${req.schema}' END -- schema
    AND c.relname = '${req.name}' -- object
) x
WHERE ( x.type = '${req.type || ""}' OR '${req.type || ""}' = '') -- type filter
    `;
    const result = await this.execute(
      query,
      req.database ? { database: req.database } : undefined,
    );
    const rows = result.rows || [];
    if (rows.length) {
      /*
      r = ordinary table,
      i = index,
      S = sequence,
      t = TOAST table,
      v = view,
      m = materialized view,
      c = composite type,
      f = foreign table,
      p = partitioned table,
      I = partitioned index
      */
      res = {
        name: rows[0].name,
        schema: rows[0].schema,
        database: rows[0].database,
        exists: true,
        oid: rows[0].oid,
        dbdata: rows[0],
        type: rows[0].type,
      };
      return res;
    }
    return res;
  }

  getCurrentDatabaseLocal(): string {
    return this.#currentDatabase || "";
  }

  async getCurrentDatabase(changes?: { database?: string }): Promise<string> {
    if (changes && changes!.database) {
      return changes!.database;
    } else if (this.#currentDatabase) {
      return this.#currentDatabase;
    }
    this.#currentDatabase = "";
    const query = "SELECT current_database() current_database";
    const result = await this.execute(query, changes);
    const rows = result.rows || [];
    if (rows.length) {
      this.#currentDatabase = rows[0].current_database;
    }
    this.#currentDatabase = this.#currentDatabase || "spinosaurus";
    return this.#currentDatabase;
  }

  getCurrentSchemaLocal(): string {
    return this.#currentSchema || "";
  }

  async getCurrentSchema(): Promise<string> {
    if (this.#currentSchema) {
      return this.#currentSchema;
    }
    this.#currentSchema = "";
    const query = `SELECT current_schema() "current_schema"`;
    const result = await this.execute(query);
    const rows = result.rows || [];
    if (rows.length) {
      this.#currentSchema = rows[0].current_schema;
    }
    this.#currentSchema = this.#currentSchema || "public";
    return this.#currentSchema;
  }

  getDbColumnType = (
    req: {
      spitype?: ColumnType;
      length?: number;
      precision?: number;
      scale?: number;
      autoIncrement?: "increment" | "uuid";
    },
  ): string => {
    const { spitype, length, precision, scale, autoIncrement } = req;
    if (
      (!spitype ||
        ["numeric", "bigint", "integer", "smallint"].includes(spitype)) &&
      autoIncrement === "increment"
    ) {
      return "serial";
    } else if (!spitype && autoIncrement === "uuid") {
      return "uuid";
    }

    let columnType: string;
    if (["bytearray"].includes(spitype || "")) {
      columnType = "bytea";
    } else if (["varchar"].includes(spitype || "") && length) {
      columnType = `character varying (${length})`;
    } else if (["numeric"].includes(spitype || "") && precision && scale) {
      columnType = `numeric (${precision},${scale})`;
    } else if (["numeric"].includes(spitype || "") && precision) {
      columnType = `numeric (${precision})`;
    } else if (
      ["numeric"].includes(spitype || "") && !precision && length == 8
    ) {
      columnType = `bigint`;
    } else if (
      ["numeric"].includes(spitype || "") && !precision && length == 4
    ) {
      columnType = `integer`;
    } else if (
      ["numeric"].includes(spitype || "") && !precision && length == 2
    ) {
      columnType = `smallint`;
    } else {
      columnType = spitype || "";
    }

    return columnType;
  };

  async getMetadata(): Promise<MetadataStore> {
    const metadata: MetadataStore = new MetadataStore();
    const query = `
SELECT *
FROM information_schema.columns c 
WHERE c.table_schema NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
    `;
    const pgr = await this.execute(query);
    let rows: any[] = pgr.rows || [];
    rows = rows.sort((a, b) =>
      <number> a.ordinal_position < <number> b.ordinal_position
        ? -1
        : <number> a.ordinal_position > <number> b.ordinal_position
        ? 1
        : 0
    )
      .sort((a, b) =>
        <string> a.table_name < <string> b.table_name
          ? -1
          : <string> a.table_name > <string> b.table_name
          ? 1
          : 0
      )
      .sort((a, b) =>
        <string> a.table_schema < <string> b.table_schema
          ? -1
          : <string> a.table_schema > <string> b.table_schema
          ? 1
          : 0
      )
      .sort((a, b) =>
        <string> a.table_catalog < <string> b.table_catalog
          ? -1
          : <string> a.table_catalog > <string> b.table_catalog
          ? 1
          : 0
      );
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      /**
       * Find schemas
       */
      const schema = metadata.schemas.find((x) => x.name === row.table_schema);
      if (!schema) {
        metadata.schemas.push({ name: row.table_schema });
      }

      /**
       * Find tables
       */
      let table = metadata.tables.find((x) =>
        x.mixeds!.name === row.table_name
      );
      if (!table) {
        const mixeds: EntityOptions = {
          database: <string> row.table_catalog,
          schema: <string> row.table_schema,
          name: <string> row.table_name,
        };
        metadata.tables.push({
          // target,
          // options,
          mixeds,
          columns: [],
        });
        table = metadata.tables[metadata.tables.length - 1];
      }
      const type = {
        columnType: <string> row.data_type,
        length: <number> row.character_maximum_length,
        precision: <number> row.numeric_precision,
        scale: <number> row.numeric_scale,
      };
      const column = {
        target: <ColumnOptions> {},
        entity: { name: <string> row.table_name },
        descriptor: <any> {},
        property: <any> {},
        options: <ColumnOptions> {},
        mixeds: <ColumnOptions> {
          type: this.getColumnTypeReverse(type),
          name: <string> row.column_name,
          length: <number> row.character_maximum_length,
          nullable: row.is_nullable == "YES",
          default: row.column_default,
          // default:
          //   ["text", "varchar"].includes(
          //       this.getColumnTypeReverse(type) || "",
          //     ) &&
          //     (row.column_default || "")
          //     ? row.column_default.replace(/::text/ig, "").replace(
          //       /^'|'$/ig,
          //       "",
          //     )
          //     : row.column_default,
        },
      };
      table.columns.push(column);
      metadata.columns.push(column);
    }

    return metadata;
  }

  getColumnTypeReverse(
    req: {
      columnType: string;
      length?: number;
      precision?: number;
      scale?: number;
    },
  ) {
    const { columnType, length /*, precision, scale*/ } = req;
    let r: ColumnType;
    const charAlikes = [
      "character",
      "character varying",
      "inet",
      "uuid",
      "macaddr",
      "macaddr8",
      "jsonb",
      "json",
      "xml",
      "cidr",
    ];
    if (columnType == "bit") {
      r = "boolean";
    } else if (columnType == "bytea") {
      r = "bytearray";
    } else if (length && charAlikes.includes(columnType)) {
      r = "varchar";
    } else if (charAlikes.includes(columnType)) {
      r = "text";
    } else if (["double precision", "real", "money"].includes(columnType)) {
      r = "numeric";
    } // else if(scale && ["numeric"].includes(columnType))
    //   r = "integer";
    else {
      r = <ColumnType> columnType;
    }

    if (!r) {
      return;
    }
    return r;
  }

  async execute(query: string, changes?: any): Promise<ExecuteResult> {
    // const driverConf = filterConnectionProps(KEY_CONFIG, this.options, changes);
    // const pool = (initConnection(driverConf) as postgres.Pool);
    // const client = await pool.connect();
    // const pgr = await client.queryObject(query);
    // client.release();
    // await pool.end();
    // const rquery = <Query> pgr.query;
    // const rrowCount = pgr.rowCount;
    // const rrowDescription = pgr.rowDescription;
    // const rrows = pgr.rows;
    // const rs = new ExecuteResult(rquery, rrowCount, rrowDescription, rrows);
    // return rs;

    const driverConf = filterConnectionProps(KEY_CONFIG, this.options, changes);
    const client = new postgres.Client(driverConf);
    await client.connect();
    const pgr = await client.queryObject(query);
    client.end();
    const rquery = <Query> pgr.query;
    const rrowCount = pgr.rowCount;
    const rrowDescription = pgr.rowDescription;
    const rrows = pgr.rows;
    const rs = new ExecuteResult(rquery, rrowCount, rrowDescription, rrows);
    return rs;
  }

  async getOne(query: string): Promise<any> {
    return {};
  }
  async getRawOne(query: string): Promise<any> {
    const rows = await this.getRawMany(query);
    return rows.length ? rows[0] : null;
  }
  async getMany(query: string): Promise<Array<any>> {
    return [];
  }
  async getRawMany(query: string): Promise<Array<any>> {
    const driverConf = filterConnectionProps(KEY_CONFIG, this.options);
    const pool = (initConnection(driverConf) as postgres.Pool);
    const client = await pool.connect();
    //const query = this.getQuery();
    const result = await client.queryObject(query);
    client.release();
    await pool.end();
    return result.rows;
  }
  async getRawMultiple(query: string): Promise<Array<any>> {
    const driverConf = filterConnectionProps(KEY_CONFIG, this.options);
    const pool = (initConnection(driverConf) as postgres.Pool);
    const client = await pool.connect();
    // const query = this.getQuery();
    const result = await client.queryObject(query);
    client.release();
    await pool.end();
    return result.rows;
  }
  /* Returns entities*/
}

export { ConnectionPostgres };
