import { DefaultType } from "./default_type.ts";
/**
 * Describes all columns's entity options.
 */
export interface VersionColumnOptions {
  /**
   * Column type. One of the supported column types.
   */
  spitype?: "smallint" | "integer" | "bigint";
  /**
   * Column name in the database table. By default the column name is generated from the name of the property. You can change it by specifying your own name.
   */
  name?: string;
  /**
   * Makes column NULL or NOT NULL in the database. By default column is nullable: false.
   */
  nullable?: boolean;
  /**
   * Defines whether or not to hide this column by default when making queries. When set to false, the column data will not show with a standard query. By default column is select: true
   */
  select?: boolean;
  /**
   * Indicates if column value is set the first time you insert the object. Default value is true.
   */
  insert?: boolean;
  /**
   * Indicates if column value is updated by "execute" operation. If false, you'll be able to write this value only when you first time insert the object. Default value is true.
   */
  update?: boolean;
  /**
   * Adds database-level column's DEFAULT value.
   */
  default?: DefaultType | Function; // DefaultType
  /**
   * Database's column comment. Not supported by all database types.
   */
  comment?: string;
}
