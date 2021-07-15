import { EntityOptions } from "../options/entity_options.ts";
import { getTempMetadata } from "../metadata/metadata.ts";

export function Entity(options: EntityOptions = {}): any {
  return function (target: Function) {
    let mixeds: EntityOptions = { name: target.name };
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
