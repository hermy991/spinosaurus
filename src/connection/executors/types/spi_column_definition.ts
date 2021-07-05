
import {ColumnType} from "../../../decorators/options/column_type.ts";

export type SpiColumnDefinition = {
  columnName: string,
  spitype: ColumnType,
  length?: number,
  precision?: number,
  scale?: number,
  nullable?:boolean
}