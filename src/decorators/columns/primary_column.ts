import { tsaveObject } from "../../stores/store.ts";
import { ColumnOptions } from "../options/column_options.ts";
import { PrimaryColumnOptions } from "../options/primary_column_options.ts";
import { getColumnType, getTempMetadata } from "../metadata/metadata.ts";
import { reflect } from "../../../deps.ts";

export function PrimaryColumn(options: PrimaryColumnOptions = {}): any {
  return (entityf: Object, propertyKey: string, descriptor: PropertyDescriptor) => {
    const fun = (entityf instanceof Function ? <Function> entityf : entityf.constructor);
    tsaveObject({ storeType: "column", params: { classFunction: fun, propertyKey, options } });
    const entity = { target: fun, name: fun.name };
    const property = {
      propertyKey,
      type: reflect.getMetadata("design:type", entityf, propertyKey),
    };
    const target: ColumnOptions = {
      name: propertyKey,
      spitype: getColumnType({ type: property.type }),
    };
    const special: PrimaryColumnOptions | { primary: boolean } = {
      primary: true,
      update: false,
    };
    const mixeds: PrimaryColumnOptions | { primary: boolean } = Object
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
