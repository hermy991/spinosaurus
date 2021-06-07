import {ColumnOptions} from "../options/column_options.ts"
import {getMetadata} from "../metadata/metadata.ts"
// import { Reflect } from "https://deno.land/x/reflect_metadata@v0.1.12/mod.ts";

// const ColumnMetadataKey = Symbol("Column");

// http://tutorialspots.com/typescript-tutorial-lesson-29-metadata-reflection-5988.html

export function Column(options: ColumnOptions = {}): any {
  return  (entity: Object, propertyKey: string, descriptor: PropertyDescriptor) => {
    /**
     * For static member entity param will be a function constructor 
     */
    let table = entity instanceof Function ? <Function>entity : entity.constructor;
    let target: ColumnOptions = { name: propertyKey};
    let mixeds: ColumnOptions = Object.assign(target, options);
    





    // let temp = entity.constructor.apply(entity);
    // let temp = [];

    // console.log()
    // console.log(`Inside @Column`)
    // console.log(`  options = `, options);
    // console.log(`  entity = `, entity);
    // console.log(`    entity instanceof Function = `, entity instanceof Function);
    // console.log(`    typeof entity = `, typeof entity);
    // console.log(`  propertyKey = `, propertyKey);
    // console.log(`  descriptor = `, descriptor);
    // console.log(`  Reflect.metadata(ColumnMetadataKey, entity) = `, Reflect.metadata(ColumnMetadataKey, entity));
    // console.log(`    playground = `, );


    // console.log("  Column = ", propertyKey);
    const column = {
      // path,
      target,
      table,
      descriptor,
      options,
      mixeds,
    }
    getMetadata().columns.push(column);
    // const tables = getMetadata().tables;
    // for(const table of tables){
    //   console.log(`    table.target(${table.target.name}) === column.table(${column.table.name}) = `, table.target === column.table)
    //   if(table.target === column.table){
    //     table.columns.push(column);
    //   }
      
    // }

  }
}
