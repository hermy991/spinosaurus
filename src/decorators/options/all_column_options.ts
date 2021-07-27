import { ColumnOptions } from "./column_options.ts";
import { GeneratedColumnOptions } from "./generated_column_options.ts";
import { PrimaryColumnOptions } from "./primary_column_options.ts";
/**
 * Describes all columns's entity options when is primary.
 */
export type AllColumnOptions =
  | ColumnOptions
  | PrimaryColumnOptions
  | GeneratedColumnOptions;
