import { MetadataStore } from "./metadata_store.ts";
import { ColumnType } from "../options/column_type.ts";
import { ConnectionOptions } from "../../connection/connection_options.ts";

const DEFAULT_CONN_NAME = "default";

export const GLOBAL_METADATA_KEY = "spinosaurusMetadataStore";

export const GLOBAL_TEMP_METADATA_KEY = "spinosaurusTempMetadataStore";

declare global {
  var [GLOBAL_METADATA_KEY]: any;
  interface Window {
    [k: string]: any;
  }
}

/**
 * Without params, default key will be return from registry
 */
export function getMetadata(): MetadataStore;

/**
  * Name key will be return from registry
  */
export function getMetadata(name: string): MetadataStore;

/**
  * Option name atribute will be return from registry
  */
export function getMetadata(options: ConnectionOptions): MetadataStore;

/**
  * Option name atribute or name param will be return from registry
  */
export function getMetadata(
  nameOrOptions?: string | ConnectionOptions,
): MetadataStore {
  const name =
    (typeof nameOrOptions == "object" ? nameOrOptions.name : nameOrOptions) ||
    DEFAULT_CONN_NAME;
  if (!window[GLOBAL_METADATA_KEY]) {
    window[GLOBAL_METADATA_KEY] = {};
  }
  if (!window[GLOBAL_METADATA_KEY][name]) {
    window[GLOBAL_METADATA_KEY][name] = window[GLOBAL_TEMP_METADATA_KEY]
      ? getTempMetadata()
      : new MetadataStore();
    clearTempMetadata();
  }
  return window[GLOBAL_METADATA_KEY][name];
}

/**
 * Without params, default key will be return from temp registry
 */
export function getTempMetadata(): MetadataStore;

/**
 * Name key will be return from temp registry
 */
export function getTempMetadata(name: string): MetadataStore;

/**
 * Option name atribute will be return from temp registry
 */
export function getTempMetadata(options: ConnectionOptions): MetadataStore;

/**
 * Option name atribute or name param will be return from temp registry
 */
export function getTempMetadata(
  nameOrOptions?: string | ConnectionOptions,
): MetadataStore {
  const name =
    (typeof nameOrOptions == "object" ? nameOrOptions.name : nameOrOptions) ||
    DEFAULT_CONN_NAME;
  if (!window[GLOBAL_TEMP_METADATA_KEY]) {
    window[GLOBAL_TEMP_METADATA_KEY] = {};
  }
  if (!window[GLOBAL_TEMP_METADATA_KEY]) {
    window[GLOBAL_TEMP_METADATA_KEY][name] = new MetadataStore();
  }
  return window[GLOBAL_TEMP_METADATA_KEY][name];
}

/**
 * Without params default key will be deleted on registry
 */
export function clearMetadata(): void;

/**
 * Name key will be deleted on registry
 */
export function clearMetadata(name: string): void;

/**
 * Option name atribute will be deleted on registry
 */
export function clearMetadata(options: ConnectionOptions): void;

/**
 * Option name atribute or name param will be deleted on registry
 */
export function clearMetadata(
  nameOrOptions?: string | ConnectionOptions,
): void {
  const name =
    (typeof nameOrOptions == "object" ? nameOrOptions.name : nameOrOptions) ||
    DEFAULT_CONN_NAME;
  if (window[GLOBAL_METADATA_KEY]) {
    delete window[GLOBAL_METADATA_KEY][name];
  } else {
    window[GLOBAL_METADATA_KEY] = {};
  }
}

/**
 * Without params default key will be deleted on temp registry
 */
export function clearTempMetadata(): void;

/**
  * Name key will be deleted on temp registry
  */
export function clearTempMetadata(name: string): void;

/**
  * Option name atribute will be deleted on temp registry
  */
export function clearTempMetadata(options: ConnectionOptions): void;

/**
  * Option name atribute or name param will be deleted on temp registry
  */
export function clearTempMetadata(nameOrOptions?: string | ConnectionOptions) {
  const name =
    (typeof nameOrOptions == "object" ? nameOrOptions.name : nameOrOptions) ||
    DEFAULT_CONN_NAME;
  if (window[GLOBAL_TEMP_METADATA_KEY]) {
    delete window[GLOBAL_TEMP_METADATA_KEY][name];
  } else {
    window[GLOBAL_TEMP_METADATA_KEY] = {};
  }
}

export function getColumnType(
  params: { type: any; options?: any; value?: any },
) {
  let { type, options, value } = params;
  let spitype: ColumnType | undefined = undefined;
  /**
 * Type by value
 */
  if (value != undefined && value != null) {
    type = value.constructor;
  }
  /**
 * Type by explicit type
 */
  if (type.name === "ArrayBuffer" || type.name === "Blob") {
    spitype = "bytearray";
  } else if (type.name === "String") {
    spitype = "text";
  } else if (type.name === "Number") {
    spitype = "numeric";
  } else if (type.name === "Boolean") {
    spitype = "boolean";
  } else if (type.name === "Date") {
    spitype = "timestamp";
  } else if (type.name === "BigInt") {
    spitype = "bigint";
  }
  /**
 * Type by options
 */
  if (options) {
    if (type.name === "String" && options.length) {
      spitype = `varchar`;
    } else if (type.name === "Number" && options.precision) {
      spitype = "numeric";
    } else if (type.name === "Number") {
      if (options.length == 2) {
        spitype = `smallint`;
      } else if (options.length == 4) {
        spitype = `integer`;
      } else if (options.length == 8) {
        spitype = `bigint`;
      }
    }

    if (options.type) {
      spitype = options.type;
    }
  }
  return spitype;
}
