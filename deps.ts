declare global {
  var [GLOBAL_STORE_KEY]: any;
  interface Window {
    [k: string]: any;
  }
}

export * as postgres from "https://deno.land/x/postgres@v0.14.2/mod.ts";
export * as path from "https://deno.land/std@0.114.0/path/mod.ts";
export * as fs from "https://deno.land/std@0.114.0/fs/mod.ts";
export * as yaml from "https://deno.land/std@0.114.0/encoding/yaml.ts";
export * as hash from "https://deno.land/std@0.114.0/hash/mod.ts";
export * as reflect from "https://cdn.skypack.dev/@abraham/reflection";
//export { Reflect as reflect } from "https://deno.land/x/reflect_metadata@v0.1.12-2/mod.ts";
export * as dotenv from "https://deno.land/x/dotenv_parser@v1.0.2/mod.ts";
export * as xml from "https://deno.land/x/xml@2.0.1/mod.ts";
