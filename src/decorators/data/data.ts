import { getTempMetadata } from "../metadata/metadata.ts";
import { ParamData } from "../../connection/builders/params/param_data.ts";
/**
 * Creates a database insert.
 * Can be used on entity.
 * Can insert entities after entity is created in the database
 */
export function Data(entities: ParamData | ParamData[]): any {
  return function (target: Function) {
    getTempMetadata().data.unshift({
      target,
      entries: Array.isArray(entities) ? entities : [entities],
    });
  };
}
