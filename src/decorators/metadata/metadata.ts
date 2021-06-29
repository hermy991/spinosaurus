import {MetadataStore} from "./metadata_store.ts";
import {ColumnType} from "../options/column_type.ts";


export const GLOBAL_METADATA_KEY = "spinosaurusMetadataStore";

declare global {
  var [GLOBAL_METADATA_KEY]: any;
  interface Window {
    [k: string]: any;
  }
}

export function getMetadata(): MetadataStore {
  if(!window[GLOBAL_METADATA_KEY]){
    window[GLOBAL_METADATA_KEY] = new MetadataStore();
  }
  return window[GLOBAL_METADATA_KEY];
}

export function getColumnType(params: { type: any, options?: any, value?: any}): string | undefined {
  let {type, options, value} = params;
  let spitype: ColumnType | undefined = undefined;
/**
 * Type by value
 */
  if(value != undefined && value != null){
    // console.log({type, "value.constructor": value.constructor});
    type = value.constructor;
  }
/**
 * Type by explicit type
 */
  if(type.name === "ArrayBuffer" || type.name === "Blob"){
    spitype = "bytearray";
  }
  else if(type.name === "String"){
    spitype = "text";
  }
  else if(type.name === "Number"){
    spitype = "numeric";
  }
  else if(type.name === "Boolean"){
    spitype = "boolean";
  }
  else if(type.name === "Date"){
    spitype = "timestamp";
  }
  else if(type.name === "BigInt"){
    spitype = "bigint";
  }
/**
 * Type by options
 */
  if(options){
    if(type.name === "String"){
      spitype = "text";
      if(options.length){
        spitype = `varchar(${options.length})`;
      }
    }
    else if(type.name === "Number"){
      spitype = "numeric";
      if(options.precision && options.scale){
        spitype = `${spitype}(${options.precision}, ${options.scale})`;
      }
      if(options.precision){
        spitype = `${spitype}(${options.precision})`;
      }
    }
    else if(type.name === "Date"){
      spitype = "timestamp";
    }

    if(options.type){
      if(options.type == "numeric" && options.precision && options.scale){
        spitype = `${options.type}(${options.precision}, ${options.scale})`;
      }
      else if(options.type == "numeric" && options.precision){
        spitype = `${options.type}(${options.precision})`;
      }
      else if(options.type == "varchar" && options.length){
        spitype = `${options.type}(${options.length})`;
      }
      else {
        spitype = options.type
      }
    }

  }
  return spitype;
}