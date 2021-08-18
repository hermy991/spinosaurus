import { fs } from "../../../deps.ts";
import { SpiColumnDefinition } from "../executors/types/spi_column_definition.ts";
import { SpiCheckDefinition } from "../executors/types/spi_check_definition.ts";
import { SpiColumnAdjust } from "../executors/types/spi_column_adjust.ts";
import { ConnectionOptionsAll } from "../connection_options.ts";
import { ConnectionPostgresOptions } from "../drivers/postgres/connection_postgres_options.ts";
import { Connection } from "../connection.ts";
import {
  clearMetadata,
  getMetadata,
  getMetadataToColumnAccesors,
  getMetadataToFromData,
  linkMetadata,
} from "../../decorators/metadata/metadata.ts";
import { ConnectionAll } from "../connection_type.ts";
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
  nameOrOptions?: string | ConnectionOptionsAll,
): Promise<Connection> {
  const options = typeof nameOrOptions === "string"
    ? await getConnectionOptions(nameOrOptions)
    : nameOrOptions;
  const tconn = new Connection(<ConnectionOptionsAll> options);
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
  nameOrOptions?: string | ConnectionOptionsAll,
): Promise<string | undefined> {
  const options = typeof nameOrOptions === "string"
    ? await getConnectionOptions(nameOrOptions)
    : nameOrOptions;
  const tconn = new Connection(<ConnectionOptionsAll> options);
  const sql = await synchronize(tconn);
  return sql;
}

export async function synchronize(conn: Connection) {
  const options = conn.getConnection().options;
  if (options.synchronize) {
    const entities = typeof options.entities == "string"
      ? [options.entities]
      : options.entities;
    clearMetadata(options);
    await updateStore(conn.getConnection(), entities);
    const localMetadata = getMetadata(options);
    const destinyMetadata = await getDestinyMetadata(conn.getConnection());
    const script = await generateScript({
      conn,
      localMetadata,
      destinyMetadata,
    });
    return script.join(";\n");
  }
}

export async function updateStore(
  conn: ConnectionAll,
  entities: string[],
) {
  const connName = conn.options.name;
  for (const entity of entities) {
    for await (const file of fs.expandGlob(entity)) {
      const path = file.path.replaceAll(`\\`, `/`).replaceAll(`C:/`, `/`);
      const _ = await import(path);
    }
    /**
     * Link all object from entity
     */
    const metadata = linkMetadata({ connName });
  }
  const metadata = getMetadata(connName);
  for (const table of metadata.tables) {
    if (!table.columns.length) {
      throw (`Entity '${table.mixeds.name}' needs column(property) definition, use @Column, @PrimaryColumn, @PrimaryGeneratedColumn, etc.`);
    }
  }
}

export async function getDestinyMetadata(
  conn: ConnectionAll,
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
    if (destinyMetadata.schemas.some((x: any) => x.name === schema.name)) {
      /*
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
    const dtable = destinyMetadata.tables.find((x: any) =>
      (x.mixeds.database || ddatabase) === (topts.database || ddatabase) &&
      (x.mixeds.schema || dschema) === (topts.schema || dschema) &&
      x.mixeds.name === topts.name
    );
    if (dtable) {
      /**
       * Altering column tables'
       */
      let query = "";
      const colsa: Array<[string, SpiColumnAdjust]> = table.columns
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
      // Columns
      const columns: Array<SpiColumnDefinition> = (table.columns || []).map((
        x: any,
      ) => {
        const r = {
          ...x.property,
          ...x.mixeds,
          columnName: x.mixeds.name,
        };
        let wtype = x.property.type;
        if (x.relation && x.relation.entity) {
          wtype = x.relation.entity;
        }

        if (typeof wtype === "function") {
          const te = getMetadataToFromData({
            connName: conn.getConnection().options.name,
            entity: wtype,
          });
          const pk = <any> getMetadataToColumnAccesors({
            connName: conn.getConnection().options.name,
            entity: wtype,
          }).find((x: any) => x.primary);
          if (te && pk) {
            // console.log("te: ", te, ", pk: ", pk);
            if (!x.options.name) {
              r.name = r.columnName = `${te.entity}_${pk.name}`;
            }
          }
        }
        return r;
      });
      // Indexing duplicate columns
      for (let i = 0; i < columns.length; i++) {
        let index = 1;
        for (let y = i + 1; y < columns.length; y++) {
          if (columns[i].columnName === columns[y].columnName) {
            (<any> columns[y]).name = columns[y].columnName = `${
              columns[y].columnName
            }_${++index}`;
          }
        }
        if (index > 1) {
          (<any> columns[i]).name = columns[i].columnName = `${
            columns[i].columnName
          }_1`;
        }
      }
      //
      /**
       * Checks constraints
       */
      const checks: Array<SpiCheckDefinition> = (table.checks || []).map((
        x: any,
      ) => x.mixeds);
      const uniques = [];
      // Defined uniques constraints
      for (let i = 0; i < table.uniques.length; i++) {
        const unique = table.uniques[i].mixeds;
        uniques.push({
          name: unique.name,
          columns: unique.columns.map((x: any) =>
            (<any> (columns || []).find((c) => (<any> c).propertyKey === x))
              .name
          ),
        });
      }
      /**
       * Create entity
       */
      const qs = conn.create({ entity: topts.name, schema: topts.schema })
        .columns(...columns)
        .checks(...checks)
        .uniques(...uniques);
      const query = qs.getQuery() || "";
      script.push(query);
    }
  }
  /**
   * Relations
   */
  for (let i = 0; i < localMetadata.tables.length; i++) {
    const table = localMetadata.tables[i];
    const qa = conn.alter({
      entity: table.mixeds.name,
      schema: table.mixeds.schema,
    });
    if (table.relations.length) {
      console.log("table.relations: ", table.relations);
      const relations = table.relations.map((x: any) => ({
        name: x.relation.name,
        columns: [x.mixeds.name].filter((x) => x),
        parentEntity: x.relation.entity,
        parentColumns: x.relation.columns && x.relation.columns.length
          ? x.relation.columns
          : undefined,
      }));
      const query = qa.relations(...relations).getQuery();
      script.push(query);
    }
  }

  return script;
}
