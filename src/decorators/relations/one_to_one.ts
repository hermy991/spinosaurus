import { ColumnOptions } from "../options/column_options.ts";
import { RelationOptions } from "../options/relation_options.ts";
import { getColumnType, getTempMetadata } from "../metadata/metadata.ts";
// deno-lint-ignore camelcase
import { reflect_metadata } from "../../../deps.ts";

export function OneToOne(
  relationOptions: RelationOptions,
  columnOptions: ColumnOptions = {},
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
    const entity = { target: fun, name: fun.name };
    const property = {
      propertyKey,
      type: reflect_metadata.Reflect.getMetadata(
        "design:type",
        entityf,
        propertyKey,
      ),
    };
    relationOptions.entity ||= property.type;
    const target: ColumnOptions = {
      name: propertyKey,
      spitype: getColumnType({ type: property.type }),
    };
    const mixeds: ColumnOptions = Object.assign(target, columnOptions);
    const relation = {
      target,
      entity,
      descriptor,
      property,
      relationOptions,
      columnOptions,
      mixeds,
    };
    getTempMetadata().relations.push(relation);
  };
}
