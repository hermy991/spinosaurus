import { tsaveObject } from "../../stores/store.ts";
import { ColumnOptions } from "../options/column_options.ts";
import { PrimaryColumnOptions } from "../options/primary_column_options.ts";
import { PrimaryGeneratedColumnOptions } from "../options/primary_generated_column_options.ts";
import { getColumnType, getTempMetadata } from "../metadata/metadata.ts";
import { reflect } from "../../../deps.ts";

export function PrimaryGeneratedColumn(options: PrimaryGeneratedColumnOptions = {}): any {
  return (entityf: Object, propertyKey: string, descriptor: PropertyDescriptor) => {
    const fun = (entityf instanceof Function ? <Function> entityf : entityf.constructor);
    const special: PrimaryColumnOptions | PrimaryGeneratedColumnOptions | { primary: boolean } = {
      primary: true,
      insert: false,
      update: false,
      autoIncrement: "increment",
    };
    const type = reflect.getMetadata("design:type", entityf, propertyKey);
    tsaveObject({
      storeType: "column",
      params: { classFunction: fun, propertyKey, type, options: { ...options, ...special } },
    });
    const entity = { target: fun, name: fun.name };
    const property = { propertyKey, type };
    const target: ColumnOptions = { name: propertyKey, spitype: getColumnType({ type: property.type }) };
    const mixeds: PrimaryColumnOptions | PrimaryGeneratedColumnOptions = Object.assign(target, special, options);
    const column = { target, entity, descriptor, property, options, mixeds };
    getTempMetadata().columns.push(column);
  };
}
