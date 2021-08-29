/**
 * Creates a database check.
 * Can be used on entity property or on entity.
 * Can create checks with composite columns when used on entity.
 */
export type ParamCheck = {
  name?: string;
  expression: string;
};
