import { MetadataStore } from "./metadata_store.ts";
import { ColumnType } from "../options/column_type.ts";
import { ConnectionOptions } from "../../connection/connection_options.ts";
import { createHash } from "deno/hash/mod.ts";

const DEFAULT_CONN_NAME = "default";

export const GLOBAL_METADATA_KEY = "spinosaurusMetadataStore";

export const GLOBAL_TEMP_METADATA_KEY = "spinosaurusTempMetadataStore";

declare global {
  var [GLOBAL_METADATA_KEY]: any;
  interface Window {
    [k: string]: any;
  }
}

export function linkMetadata(
  req: { currentSquema: string; connName: string },
): MetadataStore {
  const { currentSquema, connName } = req;
  const metadata = getMetadata(connName);
  const { tables, checks, schemas, columns } = metadata;
  /**
   * Link checks constrains with tables
   */
  for (let i = 0; i < checks.length; i++) {
    const check = checks[i];
    const table = tables.find((x: any) => x.target === check.target);
    table.checks = table.checks || [];
    const hash = createHash("md5");
    hash.update(`${btoa(table.checks.length + 1)}`);
    check.mixeds.name = check.mixeds.name ||
      `CHK_${currentSquema}_${table.mixeds.name}_${hash.toString()}`;
    if (
      table &&
      !table.checks.some((x: any) => x.mixeds.name === check.mixeds.name)
    ) {
      table.checks.push(check);
    }
  }
  /**
   * Find all schemas from entities
   */
  for (const table of tables) {
    if (
      table.mixeds.schema &&
      !schemas.some((x: any) => x.name === table.mixeds.schema)
    ) {
      schemas.push({ name: table.mixeds.schema });
    }
  }
  /**
   * Link columns with tables
   */
  // console.log(" columns: ", columns);
  for (const column of columns) {
    const table = tables.find((x: any) => x.target === column.entity.target);
    if (
      table &&
      !table.columns.some((x: any) => x.mixeds.name === column.mixeds.name)
    ) {
      table.columns.push(column);
    }
  }
  return metadata;
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
  if (!window[GLOBAL_TEMP_METADATA_KEY]) {
    window[GLOBAL_TEMP_METADATA_KEY] = {};
  }
  if (!window[GLOBAL_METADATA_KEY][name]) {
    window[GLOBAL_METADATA_KEY][name] =
      window[GLOBAL_TEMP_METADATA_KEY][DEFAULT_CONN_NAME]
        ? getTempMetadata()
        : new MetadataStore();
    clearTempMetadata();
  }
  const ms = window[GLOBAL_METADATA_KEY][name];
  return ms;
}

// /**
//  * Without params, default key will be return from temp registry
//  */
// export function getTempMetadata(): MetadataStore;

// /**
//  * Name key will be return from temp registry
//  */
// export function getTempMetadata(name: string): MetadataStore;

// /**
//  * Option name atribute will be return from temp registry
//  */
// export function getTempMetadata(options: ConnectionOptions): MetadataStore;

/**
 * Option name atribute or name param will be return from temp registry
 */
export function getTempMetadata(
  // nameOrOptions?: string | ConnectionOptions,
): MetadataStore {
  const name = DEFAULT_CONN_NAME;
  if (!window[GLOBAL_TEMP_METADATA_KEY]) {
    window[GLOBAL_TEMP_METADATA_KEY] = {};
  }
  if (!window[GLOBAL_TEMP_METADATA_KEY][name]) {
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
// export function clearTempMetadata(): void;

// /**
//   * Name key will be deleted on temp registry
//   */
// export function clearTempMetadata(name: string): void;

// /**
//   * Option name atribute will be deleted on temp registry
//   */
// export function clearTempMetadata(options: ConnectionOptions): void;

// /**
//   * Option name atribute or name param will be deleted on temp registry
//   */
export function clearTempMetadata(
  // nameOrOptions?: string | ConnectionOptions
) {
  const name = DEFAULT_CONN_NAME;
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
