/**
 * The name of a column in table. The column name can be qualified with a subfield name or array subscript,
 * if needed.
 */
export type ParamUpdateSet = {
  [x: string]: string | number | boolean | Date | Function | null | undefined;
};
