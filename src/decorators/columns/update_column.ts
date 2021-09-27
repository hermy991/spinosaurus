import { ColumnOptions } from "../options/column_options.ts";
import { AllColumnOptions } from "../options/all_column_options.ts";
import { UpdateColumnOptions } from "../options/update_column_options.ts";
import { getColumnType, getTempMetadata } from "../metadata/metadata.ts";
import { reflect } from "../../../deps.ts";

export function UpdateColumn(
  options: UpdateColumnOptions,
  autoUpdate: Function,
): any {
  return (
    entityf: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => {
    /**
     * For static member entity param will be a function constructor
     */
    const funt = (entityf instanceof Function ? <Function> entityf : entityf.constructor);
    const entity = { target: funt, name: funt.name };
    const property = {
      propertyKey,
      type: reflect.getMetadata("design:type", entityf, propertyKey),
    };
    const target: ColumnOptions = {
      name: propertyKey,
      spitype: getColumnType({ type: property.type }),
    };
    const mixeds: AllColumnOptions = Object.assign(target, options, {
      autoUpdate,
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
