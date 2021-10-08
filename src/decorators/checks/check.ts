import { ParamCheck } from "../../connection/builders/params/param_check.ts";
import { getTempMetadata } from "../metadata/metadata.ts";
import { tsaveObject } from "../../stores/store.ts";
/**
 * Creates a database check.
 * Can be used on entity.
 * Can create checks with composite columns when used on entity.
 */
export function Check(options: ParamCheck): any {
  return function (target: Function) {
    tsaveObject({ storeType: "check", params: { classFunction: target, options } });
    const mixeds = Object.assign(options);

    getTempMetadata().checks.unshift({
      target,
      options,
      mixeds,
    });
  };
}
