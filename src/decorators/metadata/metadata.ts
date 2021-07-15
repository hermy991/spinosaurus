import { MetadataStore } from "./metadata_store.ts";
import { ColumnType } from "../options/column_type.ts";
import { ConnectionOptions } from "../../connection/connection_options.ts";

export const GLOBAL_METADATA_KEY = "spinosaurusMetadataStore";

export const GLOBAL_TEMP_METADATA_KEY = "spinosaurusTempMetadataStore";

declare global {
  var [GLOBAL_METADATA_KEY]: any;
  interface Window {
    [k: string]: any;
  }
}

export function getMetadata(
  connName: string | ConnectionOptions,
): MetadataStore {
  connName = typeof connName == "object" ? connName.name : connName;
  if (!window[GLOBAL_METADATA_KEY]) {
    window[GLOBAL_METADATA_KEY] = {};
  }
  if (!window[GLOBAL_METADATA_KEY][connName]) {
    window[GLOBAL_METADATA_KEY][connName] = window[GLOBAL_TEMP_METADATA_KEY]
      ? getTempMetadata()
      : new MetadataStore();
    clearTempMetadata();
  }
  return window[GLOBAL_METADATA_KEY][connName];
}

export function getTempMetadata(): MetadataStore {
  if (!window[GLOBAL_TEMP_METADATA_KEY]) {
    window[GLOBAL_TEMP_METADATA_KEY] = new MetadataStore();
  }
  return window[GLOBAL_TEMP_METADATA_KEY];
}

export function clearMetadata() {
  delete window[GLOBAL_METADATA_KEY];
}

export function clearTempMetadata() {
  delete window[GLOBAL_TEMP_METADATA_KEY];
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
    // console.log({type, "value.constructor": value.constructor});
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
