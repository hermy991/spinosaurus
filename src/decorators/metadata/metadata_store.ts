import { ColumnOptions } from "../options/column_options.ts";

export class MetadataStore {
  readonly tables: any[] = [];
  readonly schemas: Array<{ name: string }> = [];
  readonly checks: any[] = [];
  readonly uniques: any[] = [];
  readonly indices: any[] = [];
  readonly relations: any[] = [];
  readonly columns: Array<
    {
      target: ColumnOptions;
      entity: any;
      descriptor: any;
      property: any;
      options: ColumnOptions;
      mixeds: ColumnOptions;
    }
  > = [];
}
