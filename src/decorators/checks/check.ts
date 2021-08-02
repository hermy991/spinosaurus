import { CheckOptions } from "../options/check_options.ts";
import { getTempMetadata } from "../metadata/metadata.ts";
/**
 * Creates a database check.
 * Can be used on entity property or on entity.
 * Can create checks with composite columns when used on entity.
 */
export function Check(expression: string): any;
export function Check(name: string, expression: string): any;
export function Check(options: CheckOptions = {}): any {
  return function (target: Function) {
    let mixeds: CheckOptions = { name: target.name };
    mixeds = Object.assign(mixeds, options);
    const columns: any[] = [];
    const schemas: any[] = [];

    getTempMetadata().tables.push({
      // path,
      target,
      options,
      mixeds,
      columns,
    });

    if (
      mixeds.schema &&
      !getTempMetadata().schemas.some((x) => x.name === mixeds.schema)
    ) {
      getTempMetadata().schemas.push({ name: mixeds.schema });
    }
  };
}
