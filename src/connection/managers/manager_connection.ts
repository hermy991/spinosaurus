// import {path} from "../../../deps.ts";
import { fs } from "../../../deps.ts";
import { SpiColumnDefinition } from "../executors/types/spi_column_definition.ts";
import { ConnectionPostgresOptions } from "../postgres/connection_postgres_options.ts";
import { Connection } from "../connection.ts";
import { EntityOptions } from "../../decorators/options/entity_options.ts";
import { ColumnOptions } from "../../decorators/options/column_options.ts";
import {
  getColumnType,
  getMetadata,
} from "../../decorators/metadata/metadata.ts";
import { ConnectionPostgres } from "../postgres/connection_postgres.ts";
import { MetadataStore } from "../../decorators/metadata/metadata_store.ts";

export async function createConnection(
  conn?: ConnectionPostgresOptions | Array<ConnectionPostgresOptions>,
  def: number | string = 0,
) {
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
    await updateStore(entities);
    // await validateScript(getMetadata(), defConn);
    const localMetadata = getMetadata();
    const destinyMetadata = await getDestinyMetadata(defConn);
    const script = await generateScript({
      conn,
      localMetadata,
      destinyMetadata,
    });
    //console.log("script", script.join(";\n"));
    await defConn.execute(script.join(";\n"));
  }
}

export async function updateStore(entities: string[]) {
  for (const entity of entities) {
    for await (const file of fs.expandGlob(entity)) {
      const path = file.path.replaceAll(`\\`, `/`).replaceAll(`C:/`, `/`);
      const _ = await import(path);
    }
    /**
     * Link all objects
     */
    const metadata = getMetadata();
    for (const table of metadata.tables) {
      for (const column of metadata.columns) {
        if (column.entity.target === table.target) {
          table.columns = Array.isArray(table.columns) ? table.columns : [];
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
        target.name,
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
        value: instance[target.name],
      });
      // console.log({ options });
      /**
        * Class Null Data
        */
      if (target.name in instance) {
        /** Siempre tendrá valor*/
        target.nullable = false;
      }
      /**
        * Class Default Data
        */
      if (instance[target.name] != undefined) {
        target.default = instance[target.name];
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
  const metadata = getMetadata();
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
    if (destinyMetadata.tables.some((x) => x.mixeds.name == topts.name)) {
      /**
       * CHANGING
       */
      /**
       * TODO
       */
    } else {
      /**
       * NEW
       */
      const columns: SpiColumnDefinition[] = table.columns.map((x: any) => {
        const { name, type, length, precision, scale, nullable } = x.mixeds;
        return {
          columnName: name,
          spitype: type,
          length,
          precision,
          scale,
          nullable,
        };
      });

      const qs = conn.create({ entity: topts.name, schema: topts.schema })
        .columns(...columns);
      const query = qs.getQuery() || "";
      script.push(`${query}`);
    }
  }
  return script;
}
