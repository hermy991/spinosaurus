import { ColumnOptions } from "../options/column_options.ts";
import { PrimaryColumnOptions } from "../options/primary_column_options.ts";
import { PrimaryGeneratedColumnOptions } from "../options/primary_generated_column_options.ts";
import { getColumnType, getTempMetadata } from "../metadata/metadata.ts";
// deno-lint-ignore camelcase
import { reflect_metadata } from "../../../deps.ts";

export function PrimaryGeneratedColumn(
  options: PrimaryGeneratedColumnOptions = {},
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
    const target: ColumnOptions = {
      name: propertyKey,
      spitype: getColumnType({ type: property.type }),
    };
    const special: PrimaryColumnOptions | PrimaryGeneratedColumnOptions | {
      primary: boolean;
    } = {
      primary: true,
      insert: false,
      update: false,
      autoIncrement: "increment",
    };
    const mixeds: PrimaryColumnOptions | PrimaryGeneratedColumnOptions = Object
      .assign(
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
