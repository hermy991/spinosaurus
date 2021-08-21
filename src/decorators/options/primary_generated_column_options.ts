import { CharacterColumnType, NumericColumnType } from "./column_type.ts";
/**
 * Describes all columns's entity options when is primary.
 */
export interface PrimaryGeneratedColumnOptions {
  /**
   * Column type. One of the supported column types.
   */
  spitype?: NumericColumnType | CharacterColumnType;
  /**
   * Column name in the database table. By default the column name is generated from the name of the property. You can change it by specifying your own name.
   */
  name?: string;
  /**
   * Column type's length. For example, if you want to create varchar(150) type you specify column type and length options.
   */
  length?: string | number;
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
   * Database's column comment. Not supported by all database types.
   */
  comment?: string;
  /**
   * The precision for a decimal (exact numeric) column (applies only for decimal column), which is the maximum number of digits that are stored for the values. Used in some column types.
   */
  precision?: number;
  /**
   * The scale for a decimal (exact numeric) column (applies only for decimal column), which represents the number of digits to the right of the decimal point and must not be greater than precision. Used in some column types.
   */
  scale?: number;
  /**
   * Option to specify when the column would by in auto auto increment
   */
  autoIncrement?: "increment" | "uuid";
}
