import { ColumnOptions } from "../options/column_options.ts";
import { AllColumnOptions } from "../options/all_column_options.ts";
import { RelationOptions } from "../options/relation_options.ts";
import { getColumnType, getTempMetadata } from "../metadata/metadata.ts";
// deno-lint-ignore camelcase
import { reflect_metadata } from "../../../deps.ts";

export function ManyToOne(
  relationOptions: RelationOptions,
  options: ColumnOptions = {},
): any {
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
    const type = reflect_metadata.Reflect.getMetadata(
      "design:type",
      entityf,
      propertyKey,
    );
    const entity = { target: fun, name: fun.name };
    const property = { propertyKey, type };
    relationOptions.entity ||= property.type;
    const target: ColumnOptions = {
      name: propertyKey,
      spitype: getColumnType({ type: property.type }),
    };
    const mixeds: AllColumnOptions = Object.assign(target, options);
    const column = {
      target,
      entity,
      descriptor,
      property,
      relation: relationOptions,
      options,
      mixeds,
    };
    getTempMetadata().columns.push(column);
  };
}
