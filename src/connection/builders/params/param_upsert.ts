import { ParamInsertValue } from "./param_insert.ts";
import { ParamUpdateSet } from "./param_update.ts";

export type ParamUpsertEntity =
  | { entity: string; schema?: string }
  | {
    entity: Function;
    options?: { autoUpdate?: boolean; autoInsert?: boolean };
  }
  | [string, string?]
  | Function;

export type ParamUpsertValue<T> = ParamUpdateSet<T> | ParamInsertValue<T>;
