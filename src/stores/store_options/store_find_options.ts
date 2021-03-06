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

export type StoreFindRelationOptions = {
  entityOrClass: string | Function;
  relationName: string;
  defaultDatabase?: string;
  defaultSchema?: string;
  nameOrOptions?: string | ConnectionOptions;
};

export type StoreFindCheckOptions = {
  entityOrClass: string | Function;
  checkName: string;
  defaultDatabase?: string;
  defaultSchema?: string;
  nameOrOptions?: string | ConnectionOptions;
};

export type StoreFindUniqueOptions = {
  entityOrClass: string | Function;
  uniqueName: string;
  defaultDatabase?: string;
  defaultSchema?: string;
  nameOrOptions?: string | ConnectionOptions;
};
