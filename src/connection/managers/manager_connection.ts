// import {path} from "../../../deps.ts";
import { fs } from "../../../deps.ts";
import { SpiColumnDefinition } from "../executors/types/spi_column_definition.ts";
import { ConnectionOptions } from "../connection_options.ts";
import { ConnectionPostgresOptions } from "../postgres/connection_postgres_options.ts";
import { Connection } from "../connection.ts";
import { EntityOptions } from "../../decorators/options/entity_options.ts";
import { ColumnOptions } from "../../decorators/options/column_options.ts";
import { PrimaryColumnOptions } from "../../decorators/options/primary_column_options.ts";
import { GeneratedColumnOptions } from "../../decorators/options/generated_column_options.ts";
import {
  clearMetadata,
  getColumnType,
  getMetadata,
  linkMetadata,
} from "../../decorators/metadata/metadata.ts";
import { ConnectionPostgres } from "../postgres/connection_postgres.ts";
import { MetadataStore } from "../../decorators/metadata/metadata_store.ts";
import { getConnectionOptions } from "../connection_utils.ts";

/**
 * Creates a new connection from env variables, config files
 * Only one connection from config will be created
 */
export async function createConnection(): Promise<Connection>;

/**
* Creates a new connection from the env variables, config file with a given name.
*/
export async function createConnection(name: string): Promise<Connection>;

/**
 * Creates a new connection from option params.
 */
export async function createConnection(
  options: ConnectionPostgresOptions,
): Promise<Connection>;

/**
 * Creates a new connection from the env variables, config file with a given name or from option params.
 */
export async function createConnection(
  nameOrOptions?: string | ConnectionPostgresOptions,
): Promise<Connection> {
  const name = typeof nameOrOptions === "string" ? nameOrOptions : "default";
  const options = nameOrOptions instanceof Object
    ? nameOrOptions
    : await getConnectionOptions(name);
  const tconn = new Connection(options);
  const sql = await synchronize(tconn);
  if (sql) {
    await tconn.execute(sql);
  }
  return tconn;
}

/**
 * Creates a new connection from env variables, config files
 * Only one connection from config will be created
 */
export async function queryConnection(): Promise<string | undefined>;

/**
* Creates a new connection from the env variables, config file with a given name.
*/
export async function queryConnection(
  name: string,
): Promise<string | undefined>;

/**
 * Creates a new connection from option params.
 */
export async function queryConnection(
  options: ConnectionPostgresOptions,
): Promise<string | undefined>;

/**
 * Creates a new connection from the env variables, config file with a given name or from option params.
 */
export async function queryConnection(
  nameOrOptions?: string | ConnectionPostgresOptions,
): Promise<string | undefined> {
  const name = typeof nameOrOptions === "string" ? nameOrOptions : "default";
  const options = nameOrOptions instanceof Object
    ? nameOrOptions
    : await getConnectionOptions(name);
  const tconn = new Connection(options);
  const sql = await synchronize(tconn);
  return sql;
}

export async function synchronize(conn: Connection) {
  const defConn = conn.getConnection();
  if (defConn.synchronize) {
    const entities = typeof defConn.entities == "string"
      ? [defConn.entities]
      : defConn.entities;
    clearMetadata(defConn);
    await updateStore(defConn, entities);
    const localMetadata = getMetadata(defConn);
    const destinyMetadata = await getDestinyMetadata(defConn);
    const script = await generateScript({
      conn,
      localMetadata,
      destinyMetadata,
    });
    return script.join(";\n");
  }
}

export async function updateStore(
  conn: ConnectionPostgres,
  entities: string[],
) {
  const connName = conn.name;
  for (const entity of entities) {
    for await (const file of fs.expandGlob(entity)) {
      const path = file.path.replaceAll(`\\`, `/`).replaceAll(`C:/`, `/`);
      const _ = await import(path);
    }
    /**
     * Link all object from entity
     */
    const currentSquema = await conn.getCurrentSchema();
    const metadata = linkMetadata({ currentSquema, connName });
    /**
     * Mixed Entity
     */
    for (const table of metadata.tables) {
      const options: EntityOptions = table.options;
      let mixeds = { name: table.target.name };
      mixeds = Object.assign(mixeds, options);
      table.mixeds = mixeds;
    }
    /**
     * Mixed Column
     */
    for (const column of metadata.columns) {
      const target = column.target;
      const instance = new column.entity.target();
      const options: PrimaryColumnOptions | GeneratedColumnOptions =
        column.options;
      const property = column.property;
      const propertyDescriptor = Object.getOwnPropertyDescriptor(
        instance,
        target.name || "",
      );
      column.descriptor = propertyDescriptor;

      /**
       * Option Column Lenght
       */
      if (options.length) {
        options.length = Number(options.length);
      }

      /**
       * Class Column Type
       */
      options.spitype = getColumnType({
        type: property.type,
        options,
        value: instance[target.name || ""],
      });

      /**
        * Class Null Data
        */
      target.nullable = false;

      /**
        * Class Default Data
        */
      if (instance[target.name || ""] != undefined) {
        target.default = instance[target.name || ""];
      }

      /**
       * Class readonly
       */
      target.insert = !column.descriptor || column.descriptor?.writable == true;
      target.update = !column.descriptor || column.descriptor?.writable == true;

      /**
       * When auto increment is set and spitype is undefined we should set spitype to varchar or
       */
      if (
        (<GeneratedColumnOptions> options).autoIncrement && !options.spitype
      ) {
        const autoIncrement = (<GeneratedColumnOptions> options).autoIncrement;
        if (autoIncrement === "increment" && !options.spitype) {
          options.spitype = "integer";
        } else if (autoIncrement === "uuid" && !options.spitype) {
          options.spitype = "varchar";
          options.length = 30;
        }
        options.nullable = options.nullable || false;
      }

      column.mixeds = <ColumnOptions> Object.assign(target, options);
      if (!column.mixeds.spitype) {
        throw (`Property '${property.propertyKey}' Data type cannot be determined, use { type: "?" } or define the data type in the property.`);
      }
    }
  }
  const metadata = getMetadata(connName);
  for (const table of metadata.tables) {
    if (!table.columns.length) {
      throw (`Entity '${table.mixeds.name}' needs column(property) definition, use @Column, @PrimaryColumn, @PrimaryGeneratedColumn, etc.`);
    }
  }
}

export async function getDestinyMetadata(
  conn: ConnectionPostgres,
): Promise<MetadataStore> {
  const metadata: MetadataStore = await conn.getMetadata();
  return metadata;
}

export async function generateScript(
  req: {
    conn: Connection;
    localMetadata: MetadataStore;
    destinyMetadata: MetadataStore;
  },
): Promise<string[]> {
  const { conn, localMetadata, destinyMetadata } = req;
  const ddatabase = await conn.getCurrentDatabase();
  const dschema = await conn.getCurrentSchema();
  const script: string[] = [];
  /**
   * SCHEMAS
   */
  for (let i = 0; i < localMetadata.schemas.length; i++) {
    const schema = localMetadata.schemas[i];
    let query = "";
    if (destinyMetadata.schemas.some((x) => x.name === schema.name)) {
      /**
     * CHANGING
     * TODO
     */
    } else {
      /**
       * NEW
       */
      const qs = conn.create({ schema: schema.name, ...schema });
      query = qs.getQuery();
      script.push(query);
    }
  }
  /**
   * TABLES
   */
  for (let i = 0; i < localMetadata.tables.length; i++) {
    const table = localMetadata.tables[i];
    table.mixeds.database = table.mixeds.database || ddatabase;
    table.mixeds.schema = table.mixeds.schema || dschema;
    if (table.mixeds.database != ddatabase) {
      continue;
    }
    const topts = table.mixeds;
    const dtable = destinyMetadata.tables.find((x) =>
      (x.mixeds.database || ddatabase) === (topts.database || ddatabase) &&
      (x.mixeds.schema || dschema) === (topts.schema || dschema) &&
      x.mixeds.name === topts.name
    );
    if (dtable) {
      /**
       * Altering column tables'
       */
      let query = "";
      const colsa: Array<[string, SpiColumnDefinition]> = table.columns
        .filter((x: any) =>
          dtable.columns.some((y: any) => y.mixeds.name === x.mixeds.name)
        )
        .map((x: any) => [x.mixeds.name, {
          ...x.mixeds,
          columnName: x.mixeds.name,
        }]);
      if (colsa.length) {
        const qsa = conn.alter({ ...table.mixeds, entity: table.mixeds.name })
          .columns(...colsa);
        query = qsa.getQuery() || "";
        if (query) {
          script.push(query);
        }
      }
      /**
       * Adding column tables'
       */
      const colsm: Array<SpiColumnDefinition> = table.columns
        .filter((x: any) =>
          !dtable.columns.some((y: any) => y.mixeds.name === x.mixeds.name)
        )
        .map((x: any) => ({ ...x.mixeds, columnName: x.mixeds.name }));
      if (colsm.length) {
        const qsm = conn.alter({ ...table.mixeds, entity: table.mixeds.name })
          .columns(...colsm);
        query = qsm.getQuery() || "";
        if (query) {
          script.push(query);
        }
      }
      /**
       * Dropping column tables'
       */
      const colsd: Array<string> = dtable.columns
        .filter((x: any) =>
          !table.columns.some((y: any) => y.mixeds.name === x.mixeds.name)
        )
        .map((x: any) => x.mixeds.name);
      if (colsd.length) {
        const qsd = conn.drop({ ...table.mixeds, entity: table.mixeds.name })
          .columns(colsd);
        query = qsd.getQuery() || "";
        if (query) {
          script.push(query);
        }
      }
    } else {
      /**
       * New tables
       */
      const columns: Array<SpiColumnDefinition> = table.columns.map((
        x: any,
      ) => ({
        ...x.mixeds,
        ...{ columnName: x.mixeds.name },
      }));
      const qs = conn.create({ entity: topts.name, schema: topts.schema })
        .columns(...columns);
      const query = qs.getQuery() || "";
      script.push(query);
    }
  }
  return script;
}
