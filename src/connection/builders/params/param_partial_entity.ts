/**
 * Make all properties in T optional
 */
export type ParamPartialEntity<T> = {
  [P in keyof T]?: T[P] | (() => string);
};
