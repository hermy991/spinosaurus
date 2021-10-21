import { tsaveObject } from "../../stores/store.ts";
import { ColumnOptions } from "../options/column_options.ts";
import { VersionColumnOptions } from "../options/version_column_options.ts";
import { getTempMetadata } from "../metadata/metadata.ts";
import { reflect } from "../../../deps.ts";

export function VersionColumn(options: VersionColumnOptions = {}): any {
  return (entityf: Object, propertyKey: string, descriptor: PropertyDescriptor) => {
    const fun = (entityf instanceof Function ? <Function> entityf : entityf.constructor);
    const type = reflect.getMetadata("design:type", entityf, propertyKey);
    const special = { spitype: "integer", ...options, autoUpdate: () => `"${options.name || propertyKey}" + 1` };
    tsaveObject({ storeType: "column", params: { classFunction: fun, propertyKey, type, options: special } });
    const entity = { target: fun, name: fun.name };
    const property = { propertyKey, type };
    const target: ColumnOptions = { name: propertyKey, spitype: "integer" };
    const mixeds: ColumnOptions = Object.assign(target, options, {
      autoUpdate: () => `"${options.name || propertyKey}" + 1`,
    });
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
