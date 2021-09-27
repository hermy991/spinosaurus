/**
 * The name of a column in table. The column name can be qualified with a subfield name or array subscript,
 * if needed.
 */
export type ParamSimpleOptions = string | number | boolean | Date | Function | null | undefined;

export type ParamComplexOptions = {
  [x: string]: ParamSimpleOptions | Array<ParamSimpleOptions>;
};

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
