import { ParamSimpleValues } from "./param_select.ts";
import { ParamPartialEntity } from "./param_partial_entity.ts";

export type ParamInsertOptions = {
  autoInsert?: boolean;
  autoGeneratePrimaryKey?: boolean;
};

export type ParamInsertEntity =
  | { entity: string; schema?: string }
  | { entity: Function; options?: ParamInsertOptions }
  | [string, string?]
  | Function;

// export type ParamInsertValue = { [x: string]: ParamSimpleOptions | { [x: string]: ParamSimpleOptions } };
export type ParamInsertValue<T> =
  | ParamPartialEntity<T>
  | Record<string, ParamSimpleValues | Record<string, ParamSimpleValues>>;
