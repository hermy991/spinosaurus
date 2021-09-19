/**
 * ON_UPDATE type to be used to specify update strategy when some relation is being updated.
 */
export type OnUpdateType =
  | "restrict"
  | "cascade"
  | "set null"
  | "default"
  | "no action";

/**
 * ON_DELETE type to be used to specify delete strategy when some relation is being deleted from the database.
 */
export type OnDeleteType =
  | "restrict"
  | "cascade"
  | "set null"
  | "default"
  | "no action";

/**
 * Describes all relation's options.
 */
export type ParamRelation = {
  /**
   * Entity function
   */
  entity?: Function;
  /**
   * Foreign key's name
   */
  name?: string;
  /**
   * Database cascade action on delete.
   */
  onDelete?: OnDeleteType;
  /**
   * Database cascade action on update.
   */
  onUpdate?: OnUpdateType;
};

export type ParamRelationCreate = {
  name?: string;
  onDelete?: OnDeleteType;
  onUpdate?: OnUpdateType;
  columns: string[];
  parentSchema?: string;
  parentEntity: string;
  parentColumns?: string[];
};

export type ParamRelationDefinition =
  | {
    name?: string;
    onDelete?: OnDeleteType;
    onUpdate?: OnUpdateType;
    columns: string[];
    parentEntity: Function;
    parentColumns?: string[];
  }
  | ParamRelationCreate;
