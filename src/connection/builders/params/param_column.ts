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

export type ParamColumnAjust = {
  name?: string;
  spitype?: ColumnType;
  length?: number;
  precision?: number;
  scale?: number;
  nullable?: boolean;
  default?: ColumnType | Function;
  comment?: string;
  primary?: boolean;
  autoIncrement?: "increment" | "uuid";
};

export type ParamColumnGeneratedCreate = {
  name: string;
  spitype?: ColumnType;
  length?: number;
  precision?: number;
  scale?: number;
  nullable?: boolean;
  default?: ColumnType | Function;
  comment?: string;
  primary?: boolean;
  autoIncrement: "increment" | "uuid";
};

export type ParamColumnCreate = {
  name: string;
  spitype: ColumnType;
  length?: number;
  precision?: number;
  scale?: number;
  nullable?: boolean;
  default?: ColumnType | Function;
  comment?: string;
  primary?: boolean;
  autoIncrement?: "increment" | "uuid";
};

export type ParamColumnDefinition =
  | ParamColumnCreate
  | ParamColumnGeneratedCreate;
