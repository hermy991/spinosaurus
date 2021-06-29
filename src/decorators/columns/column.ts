import {ColumnOptions} from "../options/column_options.ts"
import {getMetadata, getColumnType} from "../metadata/metadata.ts"
import {reflect_metadata} from "../../../deps.ts"

export function Column(options: ColumnOptions = {}): any {
  return  (entityf: Object, propertyKey: string, descriptor: PropertyDescriptor) => {
    /**
     * For static member entity param will be a function constructor 
     */
    let entity = { target: entityf instanceof Function ? <Function>entityf : entityf.constructor, name: entityf.constructor.name };
    let property = { propertyKey, type: reflect_metadata.Reflect.getMetadata("design:type", entityf, propertyKey) };
    let target: ColumnOptions = { name: propertyKey, type: getColumnType({type: property.type}) };
    let mixeds: ColumnOptions = Object.assign(target, options);


    const column = {
      // path,
      target,
      entity,
      descriptor,
      property,
      options,
      mixeds,
    }
    getMetadata().columns.push(column);

  }
}
