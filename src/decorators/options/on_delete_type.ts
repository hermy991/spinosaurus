/**
 * ON_DELETE type to be used to specify delete strategy when some relation is being deleted from the database.
 */
export type OnDeleteType =
  | "restrict"
  | "cascade"
  | "set null"
  | "default"
  | "no action";
