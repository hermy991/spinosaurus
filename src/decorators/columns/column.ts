import {ColumnOptions} from "../options/column_options.ts"
import {getMetadata} from "../metadata/metadata.ts"
import { Reflect } from "https://deno.land/x/reflect_metadata@v0.1.12/mod.ts";

const ColumnMetadataKey = Symbol("Column");

// http://tutorialspots.com/typescript-tutorial-lesson-29-metadata-reflection-5988.html

export function Column(options: ColumnOptions = {}): any {
  return function (entity: Function, propertyKey: string, descriptor: PropertyDescriptor) {
    let mixeds: ColumnOptions = { name: propertyKey};
    mixeds = Object.assign(mixeds, options);

    console.log(Reflect.metadata(ColumnMetadataKey, entity));

    getMetadata().columns.push({
      // path,
      entity,
      descriptor,
      options,
      mixeds,
    });
  }
}
