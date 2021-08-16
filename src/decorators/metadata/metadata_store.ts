import { AllColumnOptions } from "../options/all_column_options.ts";

export class MetadataStore {
  readonly tables: any[] = [];
  readonly schemas: Array<{ name: string }> = [];
  readonly checks: any[] = [];
  readonly uniques: any[] = [];
  readonly indices: any[] = [];
  readonly relations: any[] = [];
  readonly columns: Array<
    {
      target: AllColumnOptions;
      entity: any;
      descriptor: any;
      property: any;
      options: AllColumnOptions;
      mixeds: AllColumnOptions;
    }
  > = [];
}
