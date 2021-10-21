import { tsaveObject } from "../../stores/store.ts";
import { ColumnOptions } from "../options/column_options.ts";
import { AllColumnOptions } from "../options/all_column_options.ts";
import { ParamRelation } from "../../connection/builders/params/param_relation.ts";
import { getColumnType, getTempMetadata } from "../metadata/metadata.ts";
import { reflect } from "../../../deps.ts";

export function ManyToOne(relation: ParamRelation = {}, options: ColumnOptions = {}): any {
  return (entityf: Object, propertyKey: string, descriptor: PropertyDescriptor) => {
    const fun = (entityf instanceof Function ? <Function> entityf : entityf.constructor);
    const type = reflect.getMetadata("design:type", entityf, propertyKey);
    tsaveObject({ storeType: "column_relation", params: { classFunction: fun, propertyKey, type, options, relation } });
    const entity = { target: fun, name: fun.name };
    const property = { propertyKey, type };
    relation.entity ||= property.type;
    const target: ColumnOptions = { name: propertyKey, spitype: getColumnType({ type: property.type }) };
    const mixeds: AllColumnOptions = Object.assign(target, options);
    const column = {
      target,
      entity,
      descriptor,
      property,
      relation,
      options,
      mixeds,
    };
    getTempMetadata().columns.push(column);
  };
}
