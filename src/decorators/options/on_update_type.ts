/**
 * ON_UPDATE type to be used to specify update strategy when some relation is being updated.
 */
export type OnUpdateType =
  | "restrict"
  | "cascade"
  | "set null"
  | "default"
  | "no action";
