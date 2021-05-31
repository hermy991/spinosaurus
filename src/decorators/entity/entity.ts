import {EntityOptions} from "../options/entity_options.ts"
import {getMetadata} from "../metadata/metadata.ts"

export function Entity(options?: EntityOptions): any {
  const currOptions = options;
  return function (target: any) {
    getMetadata().table.push({
      ...{target},
      ...currOptions
    });
  }
}
