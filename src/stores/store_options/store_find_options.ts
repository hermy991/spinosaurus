import { ConnectionOptions } from "../../connection/connection_options.ts";

export type StoreFindEntityOptions = {
  entityOrClass: string | Function;
  defaultDatabase?: string;
  defaultSchema?: string;
  nameOrOptions?: string | ConnectionOptions;
};

export type StoreFindColumnOptions = {
  entityOrClass: string | Function;
  propertyKey?: string;
  columnName?: string;
  defaultDatabase?: string;
  defaultSchema?: string;
  nameOrOptions?: string | ConnectionOptions;
};
