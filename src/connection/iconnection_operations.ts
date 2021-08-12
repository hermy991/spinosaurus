import { MetadataStore } from "../decorators/metadata/metadata_store.ts";
import { SpiCreateSchema } from "./executors/types/spi_create_schema.ts";
import { SpiDropSchema } from "./executors/types/spi_drop_schema.ts";
import { SpiColumnDefinition } from "./executors/types/spi_column_definition.ts";
import { SpiCheckDefinition } from "./executors/types/spi_check_definition.ts";
import { SpiUniqueDefinition } from "./executors/types/spi_unique_definition.ts";
import { SpiColumnAdjust } from "./executors/types/spi_column_adjust.ts";
import { SpiColumnComment } from "./executors/types/spi_column_comment.ts";

export interface IConnectionOperations {
  /* Internal Sql Operations*/
  getSqlFunction(fun: Function): string;
  createSchema(scd: SpiCreateSchema): string;
  dropSchema(scd: SpiDropSchema): string;
  columnDefinition(scd: SpiColumnDefinition): string;
  columnComment(scd: SpiColumnComment): string;
  createCheck(sds: SpiCheckDefinition & { entity: string }): string;
  createUnique(sds: SpiUniqueDefinition & { entity: string }): string;
  columnAlter(
    from: { schema?: string; entity: string; columnName: string },
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
