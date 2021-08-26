import { CheckOptions } from "../options/check_options.ts";
import { getTempMetadata } from "../metadata/metadata.ts";
/**
 * Creates a database insert.
 * Can be used on entity.
 * Can insert entities after entity is created in the database
 */
export function Data(entities: CheckOptions): any {
  return function (target: Function) {
    getTempMetadata().data.unshift({
      target,
      entities,
    });
  };
}
