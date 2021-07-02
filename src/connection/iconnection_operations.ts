import { MetadataStore } from "../decorators/metadata/metadata_store.ts";

export interface IConnectionOperations {
  /* Basic Connection Operations*/
  test(): Promise<boolean>;
  checkObject(req: { name: string, schema?: string, database?: string }): Promise<{ name: string, schema?: string, database?: string, exists: boolean, oid?: number, dbdata?: any, type?: string }>;
  getCurrentSchema(): Promise<string>;
  getMetadata(): Promise<MetadataStore>
  getRawOne(query: string): Promise<Array<any>>;
  getRawMany(query: string): Promise<Array<any>>;
  getRawMultiple(query: string): Promise<Array<any>>;
  /* Returns entities*/
  getOne(query: string): Promise<any>;
  getMany(query: string): Promise<Array<any>>;
}

