import { fs } from "../../../deps.ts";
import {
  ParamColumnAjust,
  ParamColumnCreate,
} from "../builders/params/param_column.ts";
import { ParamCheck } from "../builders/params/param_check.ts";
import { ParamUnique } from "../builders/params/param_unique.ts";
import { ParamData } from "../builders/params/param_data.ts";
import { ParamNext } from "../builders/params/param_next.ts";
import { ConnectionOptions } from "../connection_options.ts";
import { Connection } from "../connection.ts";
import {
  clearMetadata,
  getMetadata,
  // getMetadataColumns,
  // getMetadataEntityData,
  linkMetadata,
} from "../../decorators/metadata/metadata.ts";
import { ConnectionAll } from "../connection_type.ts";
import { MetadataStore } from "../../decorators/metadata/metadata_store.ts";
import {
  getConnectionOptions,
  getConnectionsOptions,
} from "../connection_utils.ts";

/**
 * Creates a new connection and registers it in the manager.
 * Only one connection from ormconfig will be created (name "default" or connection without name).
 */
export async function createConnection(): Promise<Connection>;

/**
 * Creates a new connection from the ormconfig file with a given name.
 */
export async function createConnection(name: string): Promise<Connection>;

/**
 * Creates a new connection and registers it in the manager.
 */
export async function createConnection(
  options: ConnectionOptions,
): Promise<Connection>;

/**
 * Creates a new connection and registers it in the manager.
 *
 * If connection options were not specified, then it will try to create connection automatically,
 * based on content of spinosaurus (env/js/ts/json/yml/xml) file or environment variables.
 * Only one connection from ormconfig will be created (name "default" or connection without name).
 */
export async function createConnection(
  nameOrOptions?: any,
): Promise<Connection> {
  const options = typeof nameOrOptions === "object"
    ? nameOrOptions
    : await getConnectionOptions(nameOrOptions);
  const tconn = new Connection(options);
  const sql = await synchronize(tconn);
  if (sql && sql.length) {
    await tconn.execute(sql.join(";\n"));
  }
  return tconn;
}

/**
 * Creates new connections and registers.
 *
 * If connection options were not specified, then it will try to create connection automatically,
 * based on content of spinosaurus (env/js/ts/json/yml/xml) file or environment variables.
 * All connections from the spinosaurus will be created.
 */
export async function createConnections(): Promise<Connection[]>;

/**
 * Creates new connections and registers.
 *
 * All connections from the spinosaurus will be created.
 */
export async function createConnections(
  options?: ConnectionOptions[],
): Promise<Connection[]> {
  options = options ? options : await getConnectionsOptions();
  const arrConn: Connection[] = [];
  for (const toptions of options) {
    const tconn = new Connection(toptions);
    const sql = await synchronize(tconn);
    if (sql?.length) {
      await tconn.execute(sql.join(";\n"));
    }
    arrConn.push(tconn);
  }
  return arrConn;
}

export async function getConnection(connectionName?: string) {
  const options = await getConnectionOptions(connectionName);
  if (!options) {
    return;
  }
  return new Connection(options);
}

/**
 * Creates a new connection from env variables, config files
 * Only one connection from config will be created
 */
export async function queryConnection(): Promise<string[]>;

/**
* Creates a new connection from the env variables, config file with a given name.
*/
export async function queryConnection(
  name: string,
): Promise<string[]>;

/**
 * Creates a new connection from option params.
 */
export async function queryConnection(
  options: ConnectionOptions,
): Promise<string[]>;

/**
 * Creates a new connection from the env variables, config file with a given name or from option params.
 */
export async function queryConnection(
  nameOrOptions?: string | ConnectionOptions,
): Promise<string[]> {
  const options = typeof nameOrOptions === "string"
    ? await getConnectionOptions(nameOrOptions)
    : nameOrOptions;
  const tconn = new Connection(<ConnectionOptions> options);
  const sqls = await synchronize(tconn) || [];
  return sqls;
}

export async function synchronize(
  conn: Connection,
): Promise<string[] | undefined> {
  const options = conn.getConnection().options;
  if (options.synchronize === true) {
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
    return script || [];
  }
}

export async function updateStore(
  conn: ConnectionAll,
  entities: string[],
) {
  const connName = conn.options.name;
  for (const entity of entities) {
    const paths: any[] = [];
    for await (const we of fs.expandGlob(entity)) {
      paths.push(we.path);
    }
    for (const path of paths) {
      const _ = await import(`file:///${path}`);
    }
    /**
     * Link all object from entity
     */
  }
  const metadata = linkMetadata({ connName });
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
      script.push(...qs.getSqls());
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
      const colsa: Array<[string, ParamColumnAjust]> = table.columns
        .filter((x: any) =>
          dtable.columns.some((y: any) => y.mixeds.name === x.mixeds.name)
        )
        .map((x: any) => [x.mixeds.name, {
          ...x.mixeds,
        }]);
      if (colsa.length) {
        const qsa = conn.alter({ ...table.mixeds, entity: table.mixeds.name })
          .columns(colsa);
        script.push(...qsa.getSqls());
      }
      /**
       * Adding column tables'
       */
      const colsm: Array<ParamColumnCreate> = table.columns
        .filter((x: any) =>
          !dtable.columns.some((y: any) => y.mixeds.name === x.mixeds.name)
        )
        .map((x: any) => x.mixeds);
      if (colsm.length) {
        const qsm = conn.alter({ ...table.mixeds, entity: table.mixeds.name })
          .columns(colsm);
        script.push(...qsm.getSqls());
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
        script.push(...qsd.getSqls());
      }
    } else {
      /**
       * New tables
       */
      // Columns
      const columns: Array<ParamColumnCreate> = (table.columns || []).map((
        x: any,
      ) => ({ ...x.property, ...x.mixeds }));
      /**
       * Checks constraints
       */
      const checks: Array<ParamCheck> = table.checks.map((
        x: any,
      ) => x.mixeds);
      const uniques: Array<ParamUnique> = table.uniques.map((
        x: any,
      ) => ({ ...x.mixeds, columns: x.mixeds.columnNames }));
      const data: Array<ParamData> = table.data
        .map((x: any) => <any[]> x.entries).flatMap((x: any[]) => x);
      const nexts: ParamNext[] = table.nexts.map((
        x: any,
      ) => x.steps);
      /**
       * Create entity
       */
      const qs = conn.create({ entity: topts.name, schema: topts.schema })
        .columns(columns)
        .checks(checks)
        .uniques(uniques)
        .data(data)
        .next(nexts);
      script.push(...qs.getSqls());
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
      const relations = table.relations.map((x: any) => ({
        name: x.relation.name,
        columns: [x.mixeds.name].filter((x) => x),
        parentEntity: x.relation.entity,
        parentColumns: x.relation.columns && x.relation.columns.length
          ? x.relation.columns
          : undefined,
      }));
      const sqls = qa.relations(relations).getSqls();
      script.push(...sqls);
    }
  }
  /**
   * Afters
   */
  for (let i = 0; i < localMetadata.tables.length; i++) {
    const table = localMetadata.tables[i];
    if (table.afters.length) {
      script.push(
        ...table.afters.map((x: any) => x.steps)
          .flatMap((x: any) => x)
          .map((x: any) => x.trim())
          .map((x: any) =>
            x.lastIndexOf(";") === x.length - 1
              ? x.substring(0, x.length - 1)
              : x
          )
          .filter((x: any) => x),
      );
    }
  }
  // for (let i = 0; i < localMetadata.afters.length; i++) {
  //   const afters = localMetadata.afters[i];
  //   script.push(
  //     ...afters.steps.flatMap((x) => x)
  //       .map((x) => x.trim())
  //       .map((x) =>
  //         x.lastIndexOf(";") === x.length - 1 ? x.substring(0, x.length - 1) : x
  //       )
  //       .filter((x) => x),
  //   );
  // }
  return script;
}
