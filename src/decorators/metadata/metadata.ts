import {MetadataStore} from "./metadata_store.ts"


export const GLOBAL_METADATA_KEY = "spinosaurusMetadataStore";

declare global {
  var [GLOBAL_METADATA_KEY]: any;
  interface Window {
    [k: string]: any;
  }
}

export function getMetadata() {
  if(!window[GLOBAL_METADATA_KEY]){
    return new MetadataStore();
  }
  return window[GLOBAL_METADATA_KEY];
}