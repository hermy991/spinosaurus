import { MetadataStore } from "../decorators/metadata/metadata_store.ts";
import { ParamSchemaDefinition } from "./builders/params/param_schema.ts";
import { ParamColumnAjust, ParamColumnCreate } from "./builders/params/param_column.ts";
import { ParamCheckCreate } from "./builders/params/param_check.ts";
import { ParamUniqueCreate } from "./builders/params/param_unique.ts";
import { ParamRelationCreate } from "./builders/params/param_relation.ts";
import { ParamCommentColumnDerinition } from "./builders/params/param_comment.ts";
import { ParamComplexOptions, ParamSimpleOptions } from "./builders/params/param_select.ts";

export interface IConnectionOperations {
  /* Internal Sql Operations*/
  stringify(value: ParamSimpleOptions | Array<ParamSimpleOptions>): string;
  interpolate(conditions: [string, ...string[]], params?: ParamComplexOptions): Array<string>;
  getSqlFunction(fun: Function): string;
  createSchema(scs: ParamSchemaDefinition): string;
  dropSchema(sds: ParamSchemaDefinition): string;
  columnDefinition(scd: ParamColumnCreate): string;
  columnComment(scc: ParamCommentColumnDerinition): string;
  createCheck(scd: ParamCheckCreate): string;
  createUnique(sud: ParamUniqueCreate): string;
  createRelation(srd: ParamRelationCreate): string;
  dropConstraint(sdr: { entity: string; name: string }): string;
  columnAlter(from: { schema?: string; entity: string; name: string }, changes: ParamColumnAjust): string[];
  /* Basic Connection Operations*/
  test(): Promise<boolean>;
  checkSchema(req: { name: string }): Promise<
    { name: string; database?: string; exists: boolean; oid?: number; dbdata?: any; type?: string }
  >;
  checkObject(
    req: { name: string; schema?: string; database?: string },
  ): Promise<
    { name: string; schema?: string; database?: string; exists: boolean; oid?: number; dbdata?: any; type?: string }
  >;
  getConstraints(sdac: { entity: string; schema?: string; types: Array<"p" | "u" | "c" | "f"> }): Promise<
    Array<{ oid: number; table_schema: string; table_name: string; constraint_name: string; constraint_type: string }>
  >;
  getCurrentDatabaseLocal(): string;
  getCurrentDatabase(): Promise<string>;
  getCurrentSchemaLocal(): string;
  getCurrentSchema(): Promise<string>;
  getMetadata(): Promise<MetadataStore>;
  createTransaction(options?: { transactionName: string; changes?: any }): Promise<any | undefined>;
  execute(query: string, options?: { changes?: any; transaction?: any }): Promise<any>;
  getOne(query: string): Promise<any>;
  getMany(query: string): Promise<Array<any>>;
  getMultiple(query: string): Promise<Array<any>>;
}
