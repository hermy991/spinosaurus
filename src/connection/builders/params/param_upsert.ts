import { ParamInsertValue } from "./param_insert.ts";
import { ParamUpdateSet } from "./param_update.ts";

/**
 * The name of a column in table. The column name can be qualified with a subfield name or array subscript,
 * if needed.
 */
export type ParamUpsertValue = ParamUpdateSet | ParamInsertValue;
