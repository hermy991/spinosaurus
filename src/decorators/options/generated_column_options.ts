import { ColumnOptions } from "./column_options.ts";
/**
 * Describes all columns's entity options when is primary.
 */
export interface GeneratedColumnOptions extends ColumnOptions {
  /**
   * Option to specify when the column would by in auto auto increment
   */
  autoIncrement?: "increment" | "uuid";
}
