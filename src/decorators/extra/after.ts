import { getTempMetadata } from "../metadata/metadata.ts";
import { ParamAfter } from "../../connection/builders/params/param_after.ts";
/**
 * Execute sql sentences after all entities and constraints are created.
 * Can be used on entity.
 * Can insert entities after entity is created in the database
 */
export function After(sqlSteps: ParamAfter): any {
  return function (target: Function) {
    getTempMetadata().afters.unshift({
      target,
      steps: Array.isArray(sqlSteps) ? sqlSteps : [sqlSteps],
    });
  };
}
