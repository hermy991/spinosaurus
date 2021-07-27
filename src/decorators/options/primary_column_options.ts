import { ColumnOptions } from "./column_options.ts";
/**
 * Describes all columns's entity options when is primary.
 */
export interface PrimaryColumnOptions extends ColumnOptions {
  /**
   * Option to specify when the column would by primary key
   */
  primary?: boolean;
}
