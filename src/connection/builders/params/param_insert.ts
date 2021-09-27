import { ParamSimpleOptions } from "./param_select.ts";

export type ParamInsertOptions = {
  autoInsert?: boolean;
  autoGeneratePrimaryKey?: boolean;
};

export type ParamInsertEntity =
  | { entity: string; schema?: string }
  | { entity: Function; options?: ParamInsertOptions }
  | [string, string?]
  | Function;

export type ParamInsertValue = { [x: string]: ParamSimpleOptions | { [x: string]: ParamSimpleOptions } };
