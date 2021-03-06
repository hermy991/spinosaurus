import { ParamComplexValues, ParamSimpleValues } from "./param_select.ts";
import { ParamPartialEntity } from "./param_partial_entity.ts";

export type ParamUpdateOptions = {
  autoUpdate?: boolean;
  updateWithoutPrimaryKey?: boolean;
};

export type ParamUpdateEntity =
  | { entity: string; schema?: string }
  | { entity: Function; options?: ParamUpdateOptions }
  | [string, string?]
  | Function;

export type ParamUpdateSet<T> =
  | ParamPartialEntity<T>
  | Record<string, ParamSimpleValues | Record<string, ParamSimpleValues>>;

export type ParamUpdateParams = ParamComplexValues;

export type ParamUpdateReturning = { entity: string; as?: string } | [string, string?] | string;
