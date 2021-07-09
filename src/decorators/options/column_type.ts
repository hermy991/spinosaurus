export type NumericColumnType =
  | "smallint"
  | "integer"
  | "bigint"
  | "numeric";
export type CharacterColumnType =
  | "text"
  | "varchar";
export type BinaryColumnType = "bytearray";
export type BooleanColumnType = "boolean";
export type DateTimeColumnType =
  | "timestamp"
  | "date"
  | "time";

export type ColumnType =
  | NumericColumnType
  | CharacterColumnType
  | BinaryColumnType
  | BooleanColumnType
  | DateTimeColumnType;
