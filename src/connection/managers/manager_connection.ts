// import {path} from "../../../deps.ts";
import {fs} from "../../../deps.ts";
import {ConnectionPostgresOptions} from '../postgres/connection_postgres_options.ts'
import {Connection} from "../connection.ts";
import {EntityOptions} from "../../decorators/options/entity_options.ts";
import {ColumnOptions} from "../../decorators/options/column_options.ts";
import {getMetadata} from "../../decorators/metadata/metadata.ts"
// import {GLOBAL_METADATA_KEY} from "../../decorators/metadata/metadata.ts"

export async function createConnection(conn?: ConnectionPostgresOptions | Array<ConnectionPostgresOptions>, def: number | string = 0 ) {
  const tconn = new Connection(conn, def);
  await synchronize(tconn);
  return tconn;
}

export async function synchronize(conn: Connection){
  const defConn = conn.connections[conn.defIndex];
  if(defConn.synchronize){
    const entities = typeof defConn.entities == "string" ? [defConn.entities] : defConn.entities;
    await updateStore(entities);

  }
}

export async function updateStore(entities: string []){
  for(const entity of entities){
    for await (const file of fs.expandGlob(entity)){
      const path = file.path.replaceAll(`\\`, `/`).replaceAll(`C:/`, `/`);
      const mod = await import (path);
    }
    /**
     * Link all objects
     */
    for(const table of getMetadata().tables){
      for(const column of getMetadata().columns){
        if(column.table === table.target){
          table.columns = Array.isArray(table.columns) ? table.columns : []; 
          table.columns.push(column);
        }
      }
    }
    /**
     * Mixed Entity
     */
    for(const table of getMetadata().tables){
      let options: EntityOptions = table.options;
      let mixeds = { name: table.target.name };
      mixeds = Object.assign(mixeds, options);
      table.mixeds = mixeds;
    }
    /**
     * Mixed Column
     */
    for(const column of getMetadata().columns){
      let target = new column.target;
      let instance = new column.table();
      let options: ColumnOptions = column.options;
      const pd = Reflect.getOwnPropertyDescriptor(instance, target.name);
      
      /**
       * Option Column Lenght
       */
      if(options.length){
        options.length = Number(options.length);
      }
      
      /**
       * Class Column Type
       */
      if(typeof instance[target.name] === "string"){
        target.type = "text";
        if(options.length){
          target.type = `varchar(${options.length})`;
        }
      }
      if(typeof instance[target.name] === "number"){
        target.type = "numeric";
        if(options.precision && options.scale){
          target.type = `${target.type}(${options.precision}, ${options.scale})`;
        }
        if(options.precision){
          target.type = `${target.type}(${options.precision})`;
        }
      }
      if(typeof instance[target.name] === "bigint"){
        target.type = "bigint";
      }
      if(typeof instance[target.name] === "boolean"){
        target.type = "boolean";
      }
      if(instance[target.name] instanceof Date){
        let tv: Date = instance[target.name];
        // date
        if(tv.getFullYear() > 0){
          target.type = "date";
        }
        // time
        else if (tv.getHours() + tv.getMinutes() + tv.getSeconds() > 0) {
          target.type = "time";
        }
        // timestamp
        if(tv.getFullYear() > 0 && tv.getHours() + tv.getMinutes() + tv.getSeconds() > 0){
          target.type = "timestamp";
        }
      }
      if(instance[target.name] instanceof ArrayBuffer){
        target.type = "bytea";
      }
      /**
       * Class Default Data
       */
      if(instance[target.name] != undefined /*&& instance[target.name] != null*/){
        target.default = instance[target.name];
      }
      /**
       * Class readonly
       */
      target.insert = pd?.writable == true;
      target.update = pd?.writable == true;
      /**
       * Class access
       */
      target.select = pd?.enumerable == true;
      

      let mixeds: ColumnOptions = Object.assign(target, options);
      column.mixeds = mixeds;
    }
  }
}