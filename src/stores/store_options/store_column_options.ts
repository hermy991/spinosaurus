export type NumericColumnType = "smallint" | "integer" | "bigint" | "numeric";

export type CharacterColumnType = "text" | "varchar";

export type BinaryColumnType = "bytearray";

export type BooleanColumnType = "boolean";

export type DateTimeColumnType = "timestamp" | "date" | "time";

export type ColumnType =
  | NumericColumnType
  | CharacterColumnType
  | BinaryColumnType
  | BooleanColumnType
  | DateTimeColumnType;

export type DefaultType = boolean | number | string | Date | ArrayBuffer | Blob;

export type StoreColumnOptions = {
  /**
   * Column type. One of the supported column types.
   */
  spitype?: ColumnType;

  /**
   * Option to specify when the column would by in auto auto increment
   */
  autoIncrement?: "increment" | "uuid";

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
   * Next before upgrade to database, the values will pass throw this function in insert or upsert sentence.
   */
  autoInsert?: Function;

  /**
   * Indicates if column value is updated by "execute" operation. If false, you'll be able to write this value only when you first time insert the object. Default value is true.
   */
  update?: boolean;

  /**
   * Next before upgrade to database, the values will pass throw this function in update or upsert sentence.
   */
  autoUpdate?: Function;

  /**
   * Adds database-level column's DEFAULT value.
   */
  default?: DefaultType | Function; // DefaultType

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
   * Indicates if the column will have individual unique key.
   */
  uniqueOne?: boolean;

  /**
   * Indicates if the column will add a column to a table unique key.
   */
  unique?: boolean;

  /**
   * Connection name where entitties will be store.
   */
  connectionName?: string;
};
