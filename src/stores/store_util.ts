import { DEFAULT_CONN_NAME, GLOBAL_STORE_KEY } from "./store_globals.ts";
import { StoreData, StoreRecordData } from "./store_options/store_options.ts";
import { ConnectionOptions } from "../connection/connection_options.ts";
/**
 * entity name must be the database' name, database and schema has to be register by a decorator
 * property key must be the database' property keys
 */
export const generateIndex = (
  storeType: "entity" | "column" | "relation" | "check" | "unique",
  features: Record<string, unknown>,
  defaultDatabase?: string,
  defaultSchema?: string,
): string => {
  const database = (features.database || defaultDatabase || "{{DATABASE}}");
  const schema = (features.schema || defaultSchema || "{{SCHEMA}}");
  let entityName = undefined;
  let columnName = undefined;
  let checkName = undefined;
  let uniqueName = undefined;
  switch (storeType) {
    case "entity": {
      entityName = features.entityName;
      return `${storeType}_${database}_${schema}_${entityName}`;
    }
    case "column": {
      entityName = features.entityName;
      columnName = features.columnName;
      return `${storeType}_${database}_${schema}_${entityName}_${columnName}`;
    }
    case "relation": {
      entityName = features.entityName;
      columnName = features.columnName;
      return `${storeType}_${database}_${schema}_${entityName}_${columnName}`;
    }
    case "check": {
      entityName = features.entityName;
      checkName = features.name;
      return `${storeType}_${checkName}`;
    }
    case "unique": {
      entityName = features.entityName;
      uniqueName = features.name;
      return `${storeType}_${uniqueName}`;
    }
  }
};

export function addStore(store: StoreData, nameOrOptions?: string | ConnectionOptions) {
  const name = (typeof nameOrOptions == "object" ? nameOrOptions.name : nameOrOptions) || DEFAULT_CONN_NAME;
  window[GLOBAL_STORE_KEY][name] = { ...window[GLOBAL_STORE_KEY][name], ...store };
}

export function getStore(nameOrOptions?: string | ConnectionOptions): StoreData {
  const name = (typeof nameOrOptions == "object" ? nameOrOptions.name : nameOrOptions) || DEFAULT_CONN_NAME;
  if (!window[GLOBAL_STORE_KEY]) {
    window[GLOBAL_STORE_KEY] = {};
  }
  if (!window[GLOBAL_STORE_KEY][name]) {
    window[GLOBAL_STORE_KEY][name] = {};
  }
  const ms = window[GLOBAL_STORE_KEY][name];
  return ms;
}
