import { EntityOptions } from "../options/entity_options.ts";
import { getTempMetadata } from "../metadata/metadata.ts";
import { tsaveObject } from "../../stores/store.ts";

export function Entity(options: EntityOptions = {}): any {
  return function (target: Function) {
    let mixeds: EntityOptions = { name: target.name };
    mixeds = Object.assign(mixeds, options);
    tsaveObject({ storeType: "entity", params: { classFunction: target, options } });
    getTempMetadata().tables.push({
      target,
      options,
      mixeds,
      columns: [],
      checks: [],
      uniques: [],
      relations: [],
      data: [],
      nexts: [],
      afters: [],
    });
  };
}
