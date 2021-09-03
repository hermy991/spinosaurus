import { getTempMetadata } from "../metadata/metadata.ts";
import { ParamNext } from "../../connection/builders/params/param_next.ts";
/**
 * Execute sql sentences right after the table is created.
 * Can be used on entity.
 * Can insert entities after entity is created in the database
 */
export function Next(sqlSteps: ParamNext): any {
  return function (target: Function) {
    getTempMetadata().nexts.unshift({
      target,
      steps: Array.isArray(sqlSteps) ? sqlSteps : [sqlSteps],
    });
  };
}
