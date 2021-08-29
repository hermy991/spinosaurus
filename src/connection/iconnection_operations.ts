import { MetadataStore } from "../decorators/metadata/metadata_store.ts";
import { SpiCreateSchema } from "./executors/types/spi_create_schema.ts";
import { SpiDropSchema } from "./executors/types/spi_drop_schema.ts";
import { SpiColumnDefinition } from "./executors/types/spi_column_definition.ts";
import { SpiCheckDefinition } from "./executors/types/spi_check_definition.ts";
import { SpiUniqueDefinition } from "./executors/types/spi_unique_definition.ts";
import { SpiRelationDefinition } from "./executors/types/spi_relation_definition.ts";
import { SpiColumnAdjust } from "./executors/types/spi_column_adjust.ts";
import { SpiColumnComment } from "./executors/types/spi_column_comment.ts";
import {
  ParamComplexOptions,
  ParamSimpleOptions,
} from "./builders/params/param_select.ts";

export interface IConnectionOperations {
  /* Internal Sql Operations*/
  stringify(
    value: ParamSimpleOptions | Array<ParamSimpleOptions>,
  ): string;
  interpolate(
    conditions: [string, ...string[]],
    params?: ParamComplexOptions,
  ): Array<string>;
  getSqlFunction(fun: Function): string;
  createSchema(scs: SpiCreateSchema): string;
  dropSchema(sds: SpiDropSchema): string;
  columnDefinition(scd: SpiColumnDefinition): string;
  columnComment(scc: SpiColumnComment): string;
  createCheck(scd: SpiCheckDefinition & { entity: string }): string;
  createUnique(sud: SpiUniqueDefinition & { entity: string }): string;
  createRelation(srd: SpiRelationDefinition): string;
  dropConstraint(sdr: { entity: string; name: string }): string;
  columnAlter(
    from: { schema?: string; entity: string; name: string },
    changes: SpiColumnAdjust,
  ): string[];
  /* Basic Connection Operations*/
  test(): Promise<boolean>;
  checkSchema(req: { name: string }): Promise<
    {
      name: string;
      database?: string;
      exists: boolean;
      oid?: number;
      dbdata?: any;
      type?: string;
    }
  >;
  checkObject(
    req: { name: string; schema?: string; database?: string },
  ): Promise<
    {
      name: string;
      schema?: string;
      database?: string;
      exists: boolean;
      oid?: number;
      dbdata?: any;
      type?: string;
    }
  >;
  getConstraints(
    sdac: {
      entity: string;
      schema?: string;
      types: Array<"p" | "u" | "c" | "f">;
    },
  ): Promise<
    Array<
      {
        oid: number;
        table_schema: string;
        table_name: string;
        constraint_name: string;
        constraint_type: string;
      }
    >
  >;
  getCurrentDatabaseLocal(): string;
  getCurrentDatabase(): Promise<string>;
  getCurrentSchemaLocal(): string;
  getCurrentSchema(): Promise<string>;
  getMetadata(): Promise<MetadataStore>;
  /* Returns entities or row sql data*/
  getOne(query: string): Promise<any>;
  getMany(query: string): Promise<Array<any>>;
  getMultiple(query: string): Promise<Array<any>>;
  execute(query: string): Promise<any>;
}
