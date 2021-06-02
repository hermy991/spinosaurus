import {EntityOptions} from "../options/entity_options.ts"
import {getMetadata} from "../metadata/metadata.ts"

export function Entity(options?: EntityOptions): any {
  const currOptions = options;
  const path = new URL("", import.meta.url).pathname;
  return function (target: any) {
    getMetadata().tables.push({
      path,
      target,
      ...currOptions
    });
  }
}
