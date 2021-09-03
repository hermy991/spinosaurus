import { ParamNext } from "./param_next.ts";
import { ParamAfter } from "./param_after.ts";

export type ParamCreateData = {
  [x: string]: string | number | boolean | Date | Function | null | undefined;
};

export type ParamCreateNext = ParamNext;

export type ParamCreateAfter = ParamAfter;
