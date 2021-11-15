/**
 * The name of a column in table. The column name can be qualified with a subfield name or array subscript,
 * if needed.
 */

export type ParamFromEntity = { entity: string; schema?: string; as?: string } | { entity: Function; as?: string };

export type ParamSimpleValues = string | number | boolean | Date | Function | null | undefined;

export type ParamComplexValues = Record<string, ParamSimpleValues | ParamSimpleValues[]> | Object;

export type ParamClauseRelation =
  | { entity: string; schema?: string; as?: string; on: string | [string, ...string[]] }
  | { entity: Function; as?: string; on: string | [string, ...string[]] };

export type ParamComplexClauseRelation = { join: "inner" | "left" | "right"; select: boolean } & ParamClauseRelation;
