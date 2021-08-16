import { CheckOptions } from "../options/check_options.ts";
import { getTempMetadata } from "../metadata/metadata.ts";
/**
 * Creates a database check.
 * Can be used on entity.
 * Can create checks with composite columns when used on entity.
 */
export function Check(options: CheckOptions): any {
  return function (target: Function) {
    const mixeds = Object.assign(options);

    getTempMetadata().checks.unshift({
      target,
      options,
      mixeds,
    });
  };
}
