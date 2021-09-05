import { ParamNext } from "./param_next.ts";
import { ParamAfter } from "./param_after.ts";
import { ParamInsertOptions } from "./param_insert.ts";

export type ParamCreateOptions =
  & { createByEntity?: boolean }
  & ParamInsertOptions;

export type ParamCreateEntity =
  | { entity: string; schema?: string; options?: ParamCreateOptions }
  | { entity: Function; options?: ParamCreateOptions }
  | { schema: string; check?: boolean }
  | Function;

export type ParamCreateData = {
  [x: string]: string | number | boolean | Date | Function | null | undefined;
};

export type ParamCreateNext = ParamNext;

export type ParamCreateAfter = ParamAfter;
