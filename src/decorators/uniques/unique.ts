import { ParamUnique } from "../../connection/builders/params/param_unique.ts";
import { getTempMetadata } from "../metadata/metadata.ts";
/**
 * Creates a database unique constraints.
 * Can be used on entity.
 * Can create unique constraints with composite columns when used on entity.
 */
export function Unique(options: ParamUnique): any {
  return function (target: Function) {
    const mixeds = Object.assign(options);

    getTempMetadata().uniques.unshift({
      target,
      options,
      mixeds,
    });
  };
}
