import { ColumnOptions } from "./column_options.ts";
import { PrimaryGeneratedColumnOptions } from "./primary_generated_column_options.ts";
import { PrimaryColumnOptions } from "./primary_column_options.ts";
import { UpdateColumnOptions } from "./update_column_options.ts";
/**
 * Describes all columns's entity options when is primary.
 */
export type AllColumnOptions =
  | ColumnOptions
  | PrimaryColumnOptions
  | PrimaryGeneratedColumnOptions
  | UpdateColumnOptions
  | { [x: string]: any; primary?: boolean; autoUpdate?: Function };
