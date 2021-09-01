import { getTempMetadata } from "../metadata/metadata.ts";
/**
 * Execute sql sentences after all tables are created.
 * Can be used on entity.
 * Can insert entities after entity is created in the database
 */
export function After(sqlSteps: string | string[]): any {
  return function (target: Function) {
    getTempMetadata().afters.unshift({
      target,
      steps: Array.isArray(sqlSteps) ? sqlSteps : [sqlSteps],
    });
  };
}
