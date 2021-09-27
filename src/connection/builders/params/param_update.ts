import { ParamComplexOptions } from "./param_select.ts";
import { ParamSimpleOptions } from "./param_select.ts";

export type ParamUpdateOptions = {
  autoUpdate?: boolean;
  updateWithoutPrimaryKey?: boolean;
};

export type ParamUpdateEntity =
  | { entity: string; schema?: string }
  | { entity: Function; options?: ParamUpdateOptions }
  | [string, string?]
  | Function;

export type ParamUpdateSet = { [x: string]: ParamSimpleOptions | { [x: string]: ParamSimpleOptions } };

export type ParamUpdateParams = ParamComplexOptions;
