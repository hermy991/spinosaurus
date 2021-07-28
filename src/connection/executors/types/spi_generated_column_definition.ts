import { ColumnType } from "../../../decorators/options/column_type.ts";

/**
 * Tipo que define la capa "spinosaurus", correspondiente a las
 * columnas antes de la capa de base de datos.
 */
export type SpiGeneratedColumnDefinition = {
  columnName: string;
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
