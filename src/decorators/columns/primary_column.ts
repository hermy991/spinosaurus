import { ColumnOptions } from "../options/column_options.ts";
import { getColumnType, getMetadata } from "../metadata/metadata.ts";
import { reflect_metadata } from "../../../deps.ts";

export function PrimaryColumn(options: ColumnOptions = {}): any {
  return (
    entityf: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => {
    /**
     * For static member entity param will be a function constructor
     */
    const entity = {
      target: entityf instanceof Function
        ? <Function> entityf
        : entityf.constructor,
      name: entityf.constructor.name,
    };
    const property = {
      propertyKey,
      type: reflect_metadata.Reflect.getMetadata(
        "design:type",
        entityf,
        propertyKey,
      ),
    };
    const target: ColumnOptions = {
      name: propertyKey,
      spitype: getColumnType({ type: property.type }),
    };
    const special = { primary: true };
    const mixeds: ColumnOptions = Object.assign(target, options, special);

    const column = {
      // path,
      target,
      entity,
      descriptor,
      property,
      options,
      mixeds,
    };
    getMetadata().columns.push(column);
  };
}
