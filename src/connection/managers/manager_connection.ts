import { fs } from "../../../deps.ts";
import {
  ParamColumnAjust,
  ParamColumnCreate,
} from "../builders/params/param_column.ts";
import { StoreColumnOptions } from "../../decorators/metadata/metadata_store.ts";
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
export async function sqlConnection(): Promise<string[]>;

/**
* Creates a new connection from the env variables, config file with a given name.
*/
export async function sqlConnection(
  name: string,
): Promise<string[]>;

/**
 * Creates a new connection from option params.
 */
export async function sqlConnection(
  options: ConnectionOptions,
): Promise<string[]>;

/**
 * Creates a new connection from the env variables, config file with a given name or from option params.
 */
export async function sqlConnection(
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
  const options = conn.getDriver().options;
  if (options.synchronize === true) {
    const entities = typeof options.entities == "string"
      ? [options.entities]
      : options.entities;
    clearMetadata(options);
    await updateStore(conn.getDriver(), entities);
    const localMetadata = getMetadata(options);
    const destinyMetadata = await getDestinyMetadata(conn.getDriver());
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
    const lt = localMetadata.tables[i];
    lt.mixeds.database = lt.mixeds.database || ddatabase;
    lt.mixeds.schema = lt.mixeds.schema || dschema;
    if (lt.mixeds.database != ddatabase) {
      continue;
    }
    const topts = lt.mixeds;
    const dt = destinyMetadata.tables.find((x: any) =>
      (x.mixeds.database || ddatabase) === (topts.database || ddatabase) &&
      (x.mixeds.schema || dschema) === (topts.schema || dschema) &&
      x.mixeds.name === topts.name
    );
    // if (topts.name === "user" && dt) {
    //   console.log(
    //     "topts.schema",
    //     topts.schema,
    //     "topts.name",
    //     topts.name,
    //     "x.mixeds.schema",
    //     dt.mixeds.schema,
    //     "dt.mixeds.name",
    //     dt.mixeds.name,
    //   );
    // }
    if (dt && lt.mixeds.name) {
      /**
       * Altering column tables'
       */
      const acols: Array<
        [
          string,
          ParamColumnAjust & { type?: string },
          ParamColumnAjust & { type?: string },
        ]
      > = lt
        .columns
        .filter((x) => dt.columns.some((y) => y.mixeds.name === x.mixeds.name))
        .map((x) =>
          <any> [
            x.mixeds.name,
            x.mixeds,
            (<any> dt.columns.find((y) => y.mixeds.name === x.mixeds.name))
              .mixeds,
          ]
        );
      const qsa = conn.alter({ ...lt.mixeds, entity: lt.mixeds.name });
      acols.forEach((col) => {
        col[1].type = conn.getDriver().getDbColumnType(col[1]);
        let type = col[1].type === "serial" ? "integer" : col[1].type;
        type = type.replace(/ \([0-9]*\)/ig, "");
        // if (lt.mixeds.name === "tab") {
        //   console.log(
        //     `alter`,
        //     lt.mixeds.name,
        //     `local`,
        //     col[1],
        //     `destiny`,
        //     col[2],
        //   );
        // }
        const tcol: [string, ParamColumnAjust] = [col[0], {}];
        // spitype
        (type !== col[2].type) ? tcol[1].spitype = col[1].spitype : 0;
        // length
        (col[1].length !== col[2].length) ? tcol[1].length = col[1].length : 0;
        // precision
        (col[1].precision !== col[2].precision)
          ? tcol[1].precision = col[1].precision
          : 0;
        // scale
        (col[1].scale !== col[2].scale) ? tcol[1].scale = col[1].scale : 0;
        // nullable
        (col[1].nullable !== col[2].nullable)
          ? tcol[1].nullable = col[1].nullable
          : 0;
        // primary
        (col[1].primary !== col[2].primary)
          ? tcol[1].primary = col[1].primary
          : 0;
        // autoIncrement
        (col[1].autoIncrement !== col[2].autoIncrement)
          ? tcol[1].autoIncrement = col[1].autoIncrement
          : 0;

        if (Object.keys(tcol[1]).length) {
          qsa.addColumn(tcol);
        }
      });
      const sqlArr = qsa.getSqls();
      // if (lt.mixeds.name === "tab" && sqlArr.length) {
      // console.log(
      //   "alter ",
      //   lt.mixeds.name,
      //   "sqls.length",
      //   sqlArr.length,
      //   "sqls",
      //   sqlArr.join(";\n"),
      // );
      // }
      script.push(...sqlArr);
      /**
       * Adding column tables'
       */
      const colsm: Array<ParamColumnCreate> = lt.columns
        .filter((x) => !dt.columns.some((y) => y.mixeds.name === x.mixeds.name))
        .map((x) => <any> ({ ...x.mixeds }));
      if (colsm.length) {
        const qsm = conn.alter({ ...lt.mixeds, entity: lt.mixeds.name })
          .columns(colsm);
        script.push(...qsm.getSqls());
      }
      /**
       * Dropping column tables'
       */
      const colsd: Array<string> = dt.columns
        .filter((x) => !lt.columns.some((y) => y.mixeds.name === x.mixeds.name))
        .map((x) => x.mixeds.name || "");
      if (colsd.length && lt.mixeds.name) {
        const qsd = conn.drop({ ...lt.mixeds, entity: lt.mixeds.name })
          .columns(colsd);
        script.push(...qsd.getSqls());
      }
    } else if (topts.name) {
      /**
       * New tables
       */
      /**
       * Columns
       */
      const columns: Array<ParamColumnCreate> = lt.columns
        .map((x) => ({ ...x.property, ...x.mixeds }));
      /**
       * Checks constraints
       */
      const checks: Array<ParamCheck> = lt.checks
        .map((x) => x.mixeds);
      /**
       * Uniques constraints
       */
      const uniques: Array<ParamUnique> = lt.uniques
        .map(
          (x) => ({ ...x.mixeds, columns: (<any> x.mixeds).columnNames }),
        );
      const data: Array<ParamData> = lt.data
        .map((x) => x.entries).flatMap((x) => x);
      const nexts = lt.nexts.flatMap((x) => x.steps);
      /**
       * Create entity
       */
      const qs = conn.create({
        entity: topts.name,
        schema: topts.schema,
        options: { autoGeneratePrimaryKey: false },
      })
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
    if (table.mixeds.name) {
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
  console.log("script", script);
  window.close();
  return script;
}
