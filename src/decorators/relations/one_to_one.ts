import { ColumnOptions } from "../options/column_options.ts";
import { ParamRelation } from "../../connection/builders/params/param_relation.ts";
import { getColumnType, getTempMetadata } from "../metadata/metadata.ts";
import { reflect } from "../../../deps.ts";

export function OneToOne(
  relation: ParamRelation = {},
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
    const fun = (entityf instanceof Function ? <Function> entityf : entityf.constructor);
    const type = reflect.getMetadata("design:type", entityf, propertyKey);
    const entity = { target: fun, name: fun.name };
    const property = {
      propertyKey,
      type,
    };
    relation.entity ||= property.type;
    const target: ColumnOptions = {
      name: propertyKey,
      spitype: getColumnType({ type: property.type }),
    };
    const mixeds: ColumnOptions = Object.assign(target, options, {
      uniqueOne: true,
    });
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
