/**
 * Composite unique constraint must be set on entity classes and
 * must specify entity's fields to be unique.
 */
export type ParamUnique = {
  name?: string;
  columns: [string, ...string[]];
};
export type ParamUniqueCreate = {
  entity: string;
  schema?: string;
} & ParamUnique;
