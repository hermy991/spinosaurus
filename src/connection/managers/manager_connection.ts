// import {path} from "../../../deps.ts";
import { fs } from "../../../deps.ts";
import { SpiColumnDefinition } from "../executors/types/spi_column_definition.ts";
import { ConnectionOptions } from "../connection_options.ts";
import { ConnectionPostgresOptions } from "../postgres/connection_postgres_options.ts";
import { Connection } from "../connection.ts";
import { EntityOptions } from "../../decorators/options/entity_options.ts";
import { ColumnOptions } from "../../decorators/options/column_options.ts";
import {
  clearMetadata,
  getColumnType,
  getMetadata,
} from "../../decorators/metadata/metadata.ts";
import { ConnectionPostgres } from "../postgres/connection_postgres.ts";
import { MetadataStore } from "../../decorators/metadata/metadata_store.ts";

export async function createConnection(
  conn?: ConnectionPostgresOptions | Array<ConnectionPostgresOptions>,
  def: number | string = 0,
): Promise<Connection> {
  const tconn = new Connection(conn, def);
  await synchronize(tconn);
  return tconn;
}

export async function synchronize(conn: Connection) {
  const defConn = conn.connections[conn.defIndex];
  if (defConn.synchronize) {
    const entities = typeof defConn.entities == "string"
      ? [defConn.entities]
      : defConn.entities;
    clearMetadata();
    await updateStore(defConn, entities);
    const localMetadata = getMetadata(defConn);
    const destinyMetadata = await getDestinyMetadata(defConn);
    const script = await generateScript({
      conn,
      localMetadata,
      destinyMetadata,
    });
    console.log(script.join(";\n"));
    await defConn.execute(script.join(";\n"));
  }
}

export async function updateStore(
  connName: string | ConnectionOptions,
  entities: string[],
) {
  connName = typeof connName == "object" ? connName.name : connName;
  for (const entity of entities) {
    for await (const file of fs.expandGlob(entity)) {
      const path = file.path.replaceAll(`\\`, `/`).replaceAll(`C:/`, `/`);
      const _ = await import(path);
    }
    /**
     * Link all objects
     */
    const metadata = getMetadata(connName);
    for (const table of metadata.tables) {
      /**
       * TABLES TO SCHEMAS
       */
      // if (!metadata.schemas.some((x) => x.name === table.mixeds.schema)) {
      //   metadata.schemas.push({ name: table.mixeds.schema });
      // }
      /**
       * COLUMNS TO TABLES
       */
      for (const column of metadata.columns) {
        if (column.entity.target === table.target) {
          table.columns.push(column);
        }
      }
    }
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
      const options: ColumnOptions = column.options;
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
      // console.log({ options });
      /**
        * Class Null Data
        */
      if ((target.name || "") in instance) {
        /** Siempre tendrá valor*/
        target.nullable = false;
      }
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
       * Class access
       */

      column.mixeds = <ColumnOptions> Object.assign(target, options);
      // if(column.mixeds.name == "number1"){
      //   console.log({descriptor: column.descriptor});
      // }
      if (!column.mixeds.spitype) {
        //console.log("hola que lo que = ", {type: property.type, options, value: instance[target.name]});
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
      // console.log(`SCHEMA EXISTS: ${schema.name}`);
    } else {
      /**
       * NEW
       */
      // console.log(`SCHEMA DOES NOT EXISTS: ${schema.name}`);
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
       * CHANGING
       */
      let query = "";
      const csolds: Array<[string, SpiColumnDefinition]> = table.columns
        .filter((x: any) =>
          dtable.columns.some((y: any) => x.mixeds.name === y.mixeds.name)
        )
        .map((x: any) => [x.mixeds.name, {
          ...x.mixeds,
          columnName: x.mixeds.name,
        }]);
      if (csolds.length) {
        const qsa = conn.alter(table.mixeds)
          .columns(...csolds);
        query = qsa.getQuery() || "";
        if (query) {
          script.push(query);
        }
      }

      const csnews: Array<SpiColumnDefinition> = table.columns
        .filter((x: any) =>
          dtable.columns.some((y: any) => x.mixeds.name !== y.mixeds.name)
        )
        .map((x: any) => ({ ...x.mixeds, columnName: x.mixeds.name }));
      if (csnews.length) {
        const qsn = conn.alter(table.mixeds)
          .columns(...csnews);
        query = qsn.getQuery() || "";
        if (query) {
          script.push(query);
        }
      }
    } else {
      /**
       * NEW
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
