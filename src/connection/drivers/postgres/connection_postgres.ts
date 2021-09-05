import { ConnectionOptionsPostgres } from "../../connection_options.ts";
import { interpolate, stringify } from "../../builders/base/sql.ts";
import { IConnectionOperations } from "../../iconnection_operations.ts";
import { ParamSchemaDefinition } from "../../builders/params/param_schema.ts";
import {
  ParamColumnAjust,
  ParamColumnCreate,
  ParamColumnDefinition,
} from "../../builders/params/param_column.ts";
import { ParamCheckCreate } from "../../builders/params/param_check.ts";
import { ParamUniqueCreate } from "../../builders/params/param_unique.ts";
import { ParamRelationCreate } from "../../builders/params/param_relation.ts";
import { ParamCommentColumnDerinition } from "../../builders/params/param_comment.ts";
import {
  ParamComplexOptions,
  ParamSimpleOptions,
} from "../../builders/params/param_select.ts";
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

  constructor(public options: ConnectionOptionsPostgres) {}
  /* Basic Connection Operations*/
  stringify(value: ParamSimpleOptions | Array<ParamSimpleOptions>): string {
    if (
      value === undefined || value === null || typeof (value) == "boolean" ||
      typeof (value) == "number" || typeof (value) == "string"
    ) {
      return stringify(value);
    } else if (typeof (value) == "object" && value instanceof Date) {
      const yyyy = value.getFullYear();
      const mm = ((value.getMonth() + 1) + "").padStart(2, "0");
      const dd = (value.getDate() + "").padStart(2, "0");
      const hh24 = (value.getHours() + "").padStart(2, "0");
      const mi = (value.getMinutes() + "").padStart(2, "0");
      const ss = (value.getSeconds() + "").padStart(2, "0");
      return `TO_TIMESTAMP('${yyyy}-${mm}-${dd} ${hh24}:${mi}:${ss}', 'YYYY-MM-DD HH24:MI:SS')`;
    } else if (typeof (value) == "function" && value instanceof Function) {
      return this.getSqlFunction(value);
    } else if (Array.isArray(value)) {
      return value.map((x) => stringify(x)).join(", ");
    }
    return `NULL`;
  }
  interpolate(
    conditions: [string, ...string[]] | string,
    params?: ParamComplexOptions,
  ): Array<string> {
    const cloned = self.structuredClone(params || {});
    const keys = Object.keys(cloned);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      cloned[key] = this.stringify(cloned[key]);
    }
    conditions = Array.isArray(conditions) ? conditions : [conditions];
    return interpolate(conditions, cloned);
  }
  getSqlFunction(fun: Function): string {
    if (["_NOW", "Date"].includes(fun.name)) {
      return `now()`;
    }
    return stringify(fun);
  }
  createSchema = (scs: ParamSchemaDefinition): string => {
    /**
     * Create schema
     */
    const { schema, check } = scs;
    const sql = `CREATE SCHEMA ${check ? "IF NOT EXISTS " : ""}${schema}`;
    return sql;
  };

  dropSchema = (sds: ParamSchemaDefinition): string => {
    /**
     * Droping schema
     */
    const { schema, check } = sds;
    const sql = `DROP SCHEMA ${check ? "IF EXISTS " : ""}${schema}`;
    return sql;
  };

  columnDefinition = (scd: ParamColumnDefinition): string => {
    /**
     * Column definition
     */
    const defs: string[] = [];
    defs.push(scd.name);
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
      if (scd.default instanceof Function) {
        defs.push(`DEFAULT ${this.getSqlFunction(scd.default)}`);
      } else {
        defs.push(`DEFAULT ${this.stringify(scd.default)}`);
      }
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

  createCheck = (scd: ParamCheckCreate): string => {
    /**
     * Creating Check
     */
    const { schema, entity, name, expression } = scd;
    const sql = `ALTER TABLE ${
      [schema, entity].filter((x) => x).join(".")
    } ADD CONSTRAINT ${name} CHECK (${expression})`;
    return sql;
  };

  createUnique = (sud: ParamUniqueCreate): string => {
    /**
     * Creating Unique
     */
    const { schema, entity, name, columns } = sud;
    const sql = `ALTER TABLE ${
      [schema, entity].filter((x) => x).join(".")
    } ADD CONSTRAINT ${name} UNIQUE (${columns.join(", ")})`;
    return sql;
  };

  createRelation = (
    srd: ParamRelationCreate & { schema?: string; entity: string },
  ): string => {
    /**
     * Creating Relation
     */
    let {
      entity,
      schema,
      name,
      onDelete,
      onUpdate,
      columns,
      parentEntity,
      parentSchema,
      parentColumns,
    } = srd;
    parentColumns = (parentColumns || []).length ? parentColumns : columns;
    const sql = (`ALTER TABLE ${[schema, entity].filter((x) => x).join(".")} ` +
      `ADD CONSTRAINT ${name} ` +
      `FOREIGN KEY (${columns.join(", ")}) ` +
      `REFERENCES ${[parentSchema, parentEntity].filter((x) => x).join(".")} (${
        (parentColumns || []).join(", ")
      }) ` +
      `${onDelete ? "ON DELETE " + onDelete.toUpperCase() + " " : ""}` +
      `${onUpdate ? "ON UPDATE " + onUpdate.toUpperCase() + " " : ""}`).trim();
    return sql;
  };

  dropConstraint = (sdr: { entity: string; name: string }): string => {
    /**
     * Creating Unique
     */
    const { entity, name } = sdr;
    const sql = `ALTER TABLE ${entity} DROP CONSTRAINT ${name}`;
    return sql;
  };
  columnAlter = (
    from: { schema?: string; entity: string; name: string },
    changes: ParamColumnAjust | ParamColumnCreate,
  ): string[] => {
    const { schema, entity, name } = from;
    const querys: string[] = [];
    const efrom = `${schema ? schema + "." : ""}${entity}`;
    if (!name && !changes.name) {
      return querys;
    }
    let fname = name;
    if (name && changes.name && name != changes.name) {
      querys.push(
        `ALTER TABLE ${efrom} RENAME COLUMN ${name} TO ${changes.name}`,
      );
      fname = changes.name;
    }
    if (!name && changes.name) {
      /**
       * New column
       */
      let aquery = `ALTER TABLE ${efrom} ADD COLUMN ${changes.name} ${
        this.getDbColumnType(changes).toUpperCase()
      }`;
      if ("nullable" in changes) {
        aquery += (changes.nullable ? "" : " NOT") + " NULL";
      }
      if ("default" in changes) {
        aquery += (" DEFAULT " + this.stringify(changes.default));
      }
      querys.push(aquery);
      fname = changes.name;
    } else {
      /**
       * Alter column
       */
      if (changes.spitype) {
        const ntype = this.getDbColumnType(changes);
        let tquery =
          `ALTER TABLE ${efrom} ALTER COLUMN ${fname} TYPE ${ntype.toUpperCase()}`;
        if (["numeric"].includes(changes.spitype)) {
          tquery += ` USING (${fname})::${ntype}`;
        } else if (["boolean"].includes(changes.spitype)) {
          tquery += ` USING (${fname})::int::${ntype}`;
        } else if (["timestamp"].includes(changes.spitype)) {
          tquery += ` USING (${fname})::timestamp without time zone`;
        } else if (["bytearray"].includes(changes.spitype)) {
          tquery += ` USING (${fname})::bytea`;
        }
        querys.push(tquery);
      }
      if ("nullable" in changes) {
        querys.push(
          `ALTER TABLE ${efrom} ALTER COLUMN ${fname} ${
            changes.nullable ? "DROP" : "SET"
          } NOT NULL`,
        );
      }
      if ("default" in changes) {
        querys.push(
          `ALTER TABLE ${efrom} ALTER COLUMN ${fname} ${
            changes.default
              ? "SET DEFAULT " + this.stringify(changes.default)
              : "DROP DEFAULT"
          }`,
        );
      }
    }
    return querys;
  };

  columnComment = (scc: ParamCommentColumnDerinition): string => {
    const { schema, entity, name, comment } = scc;
    let sql = `COMMENT ON COLUMN ${
      schema ? schema + "." : ""
    }${entity}.${name} IS `;
    sql += `${
      comment === null || comment === undefined
        ? "NULL"
        : this.stringify(comment)
    }`;
    return sql;
  };

  async test(): Promise<boolean> {
    const driverConf = filterConnectionProps(KEY_CONFIG, this.options);
    try {
      const pool = (initConnection(driverConf) as postgres.Pool);
      const client = await pool.connect();
      // const query = this.getSqls()
      client.release();
      await pool.end();
      return true;
    } catch {
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

  getConstraints = async (
    sdac: {
      entity: string;
      schema?: string;
      types: Array<"p" | "u" | "c" | "f">;
    },
  ): Promise<
    Array<{
      oid: number;
      table_schema: string;
      table_name: string;
      constraint_name: string;
      constraint_type: string;
    }>
  > => {
    const { entity, schema, types } = sdac;
    const query =
      `SELECT con.oid, nsp.nspname table_schema, rel.relname table_name, con.conname constraint_name, con.contype constraint_type 
FROM pg_catalog.pg_constraint con
INNER JOIN pg_catalog.pg_class rel ON rel.oid = con.conrelid
		INNER JOIN pg_catalog.pg_namespace nsp ON nsp.oid = connamespace
WHERE nsp.nspname NOT IN('pg_catalog', 'information_schema', 'pg_toast')
	AND contype IN (${types.map((x) => `'${x}'`).join(",")})
	AND nsp.nspname = CASE WHEN '${schema}' = '' THEN CURRENT_SCHEMA() ELSE '${schema}' END 
	AND rel.relname = '${entity}'`;
    const pgr = await this.execute(query);
    const rows: Array<
      {
        oid: number;
        table_schema: string;
        table_name: string;
        constraint_name: string;
        constraint_type: string;
      }
    > = pgr.rows || [];
    return rows;
  };

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
SELECT table_catalog
  ,table_schema
  ,table_name
  ,column_name
  ,ordinal_position
  ,column_default
  ,is_nullable,data_type
  ,character_maximum_length
  ,character_octet_length
  ,numeric_precision
  ,numeric_precision_radix
  ,numeric_scale
  ,datetime_precision
  ,interval_type
  ,interval_precision
  ,character_set_catalog
  ,character_set_schema
  ,character_set_name
  ,collation_catalog
  ,collation_schema
  ,collation_name
  ,domain_catalog
  ,domain_schema
  ,domain_name
  ,udt_catalog
  ,udt_schema
  ,udt_name
  ,scope_catalog
  ,scope_schema
  ,scope_name
  ,maximum_cardinality
  ,dtd_identifier
  ,is_self_referencing
  ,is_identity
  ,identity_generation
  ,identity_start
  ,identity_increment
  ,identity_maximum
  ,identity_minimum
  ,identity_cycle
  ,is_generated
  ,generation_expression
  ,is_updatable
FROM  information_schema.columns c
WHERE c.table_schema NOT IN('pg_catalog','information_schema','pg_toast')
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
    const rows = await this.getMany(query);
    return rows.length ? rows[0] : null;
  }
  async getMany(query: string): Promise<Array<any>> {
    // const driverConf = filterConnectionProps(KEY_CONFIG, this.options);
    // const pool = (initConnection(driverConf) as postgres.Pool);
    // const client = await pool.connect();
    // const result = await client.queryObject(query);
    // client.release();
    // await pool.end();
    // return result.rows;

    const driverConf = filterConnectionProps(KEY_CONFIG, this.options);
    const client = new postgres.Client(driverConf);
    await client.connect();
    const pgr = await client.queryObject(query);
    client.end();
    return pgr.rows;
  }
  getMultiple(query: string): Promise<Array<any>> {
    throw "not implemented";
  }
}

export { ConnectionPostgres };
