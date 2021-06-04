import {ColumnOptions} from "../options/column_options.ts"
import {getMetadata} from "../metadata/metadata.ts"

export function Column(options: ColumnOptions = {}): any {
  return function (entity: Function, propertyKey: string, descriptor: PropertyDescriptor) {
    let mixeds: ColumnOptions = { name: propertyKey};
    mixeds = Object.assign(mixeds, options);
    getMetadata().columns.push({
      // path,
      entity,
      descriptor,
      options,
      mixeds,
    });
  }
}
