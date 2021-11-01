/**
 * The name of a column in table. The column name can be qualified with a subfield name or array subscript,
 * if needed.
 */
export type PartialEntity<T> = { [P in keyof T]?: T[P] | (() => string) };

export type ParamSimpleOptions = string | number | boolean | Date | Function | null | undefined | Object;

export type ParamComplexOptions = { [x: string]: ParamSimpleOptions | ParamSimpleOptions[] };

export type ParamClauseRelation =
  | {
    entity: string;
    schema?: string;
    as?: string;
    on: string | [string, ...string[]];
  }
  | {
    entity: Function;
    as?: string;
    on: string | [string, ...string[]];
  };

export type ParamComplexClauseRelation = {
  join: "inner" | "left" | "right";
  select: boolean;
} & ParamClauseRelation;
