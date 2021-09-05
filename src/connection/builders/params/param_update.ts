import { ParamComplexOptions } from "./param_select.ts";

export type ParamUpdateOptions = {
  autoUpdate?: boolean;
  updateWithoutPrimaryKey?: boolean;
};

export type ParamUpdateEntity =
  | { entity: string; schema?: string }
  | { entity: Function; options?: ParamUpdateOptions }
  | [string, string?]
  | Function;

export type ParamUpdateSet = {
  [x: string]: string | number | boolean | Date | Function | null | undefined;
};

export type ParamUpdateParams = ParamComplexOptions;
