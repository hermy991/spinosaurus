import { AllColumnOptions } from "../options/all_column_options.ts";
import { ParamData } from "../../connection/builders/params/param_data.ts";
import { ParamNext } from "../../connection/builders/params/param_next.ts";
import { ParamAfter } from "../../connection/builders/params/param_after.ts";

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
  readonly data: { target: Function; entries: ParamData[] }[] = [];
  readonly nexts: { target: Function; steps: ParamNext[] }[] = [];
  readonly afters: { target: Function; steps: ParamAfter[] }[] = [];
}
