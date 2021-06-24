import {ColumnOptions} from "../options/column_options.ts"
import {getMetadata, getColumnType} from "../metadata/metadata.ts"
import {reflect_metadata} from "../../../deps.ts"

export function Column(options: ColumnOptions = {}): any {
  return  (entity: Object, propertyKey: string, descriptor: PropertyDescriptor) => {
    /**
     * For static member entity param will be a function constructor 
     */
    let table = entity instanceof Function ? <Function>entity : entity.constructor;
    let property = { propertyKey, type: reflect_metadata.Reflect.getMetadata("design:type", entity, propertyKey) };

    if(propertyKey === "bigint2"){
      // console.log(reflect_metadata.Reflect.getOwnMetadata("design:type", entity, propertyKey))
      console.log(reflect_metadata.Reflect.getOwnMetadata("design:type", entity, propertyKey))
    }


    let target: ColumnOptions = { name: propertyKey, type: getColumnType({type: property.type}) };
    let mixeds: ColumnOptions = Object.assign(target, options);
    
    


    const column = {
      // path,
      target,
      table,
      descriptor,
      property,
      options,
      mixeds,
    }
    getMetadata().columns.push(column);

  }
}
