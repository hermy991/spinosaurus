import { ExecutorSelect } from "../../executors/executor_select.ts";
/**
 * The name of a column in table. The column name can be qualified with a subfield name or array subscript,
 * if needed.
 */

export type ParamFromOptions =
  | { entity: string; schema?: string; as?: string }
  | { entity: Function; as?: string }
  | { entity: ExecutorSelect; as?: string };

export type ParamSimpleValues = string | number | boolean | Date | Function | null | undefined;

export type ParamComplexValues = Record<string, ParamSimpleValues | ParamSimpleValues[]> | Object;

export type ParamClauseOptions =
  | { entity: string; schema?: string; as?: string; on: string | [string, ...string[]] }
  | { entity: Function; as?: string; on: string | [string, ...string[]] }
  | { entity: ExecutorSelect; as?: string; on: string | [string, ...string[]] };

export type ParamComplexClauseOptions =
  & { join: "inner" | "left" | "right"; select: boolean }
  & ParamClauseOptions;

export type ParamSelectColumn = { column: string; as?: string } | [string, string?] | string;
