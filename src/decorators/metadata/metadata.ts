import {MetadataStore} from "./metadata_store.ts"


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
  let spitype = undefined;
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
  if(typeof type() == "string"){
    spitype = "text";
  }
  else if(typeof type() == "number"){
    spitype = "numeric";
  }
  else if(typeof type() == "bigint"){
    spitype = "bigint";
  }
  else if(typeof type() == "boolean"){
    spitype = "boolean";
  }
  else if(type() instanceof Date){
    spitype = "timestamp";
  }
  else if(type() instanceof ArrayBuffer || type() instanceof Blob){
    spitype = "bytearray";
  }
/**
 * Type by options
 */
  if(options){
    if(typeof type() == "string"){
      spitype = "text";
      if(options.length){
        spitype = `varchar(${options.length})`;
      }
    }
    else if(typeof type() == "number"){
      spitype = "numeric";
      if(options.precision && options.scale){
        spitype = `${spitype}(${options.precision}, ${options.scale})`;
      }
      if(options.precision){
        spitype = `${spitype}(${options.precision})`;
      }
    }
    else if(type() instanceof Date){
      spitype = "timestamp";
    }
    if(options && options.type){
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