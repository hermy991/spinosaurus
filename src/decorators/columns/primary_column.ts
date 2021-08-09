import { ColumnOptions } from "../options/column_options.ts";
import { PrimaryColumnOptions } from "../options/primary_column_options.ts";
import { getColumnType, getTempMetadata } from "../metadata/metadata.ts";
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
    const fun =
      (entityf instanceof Function ? <Function> entityf : entityf.constructor);
    const entity = { target: fun, name: fun.name };
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
    const special: PrimaryColumnOptions = { primary: true };
    const mixeds: PrimaryColumnOptions = Object.assign(
      target,
      special,
      options,
    );

    const column = {
      target,
      entity,
      descriptor,
      property,
      options,
      mixeds,
    };
    getTempMetadata().columns.push(column);
  };
}
