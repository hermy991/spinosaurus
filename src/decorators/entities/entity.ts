import {EntityOptions} from "../options/entity_options.ts"
import {getMetadata} from "../metadata/metadata.ts"

export function Entity(options: EntityOptions = {}): any {
  return function (target: Function) {
    let mixeds: EntityOptions = { name: target.name};
    mixeds = Object.assign(mixeds, options);
    getMetadata().tables.push({
      // path,
      target,
      options,
      mixeds,
    });
  }
}
