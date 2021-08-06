import { MetadataStore } from "../decorators/metadata/metadata_store.ts";
import { SpiCreateSchema } from "./executors/types/spi_create_schema.ts";
import { SpiDropSchema } from "./executors/types/spi_drop_schema.ts";
import { SpiColumnDefinition } from "./executors/types/spi_column_definition.ts";
import { SpiColumnAdjust } from "./executors/types/spi_column_adjust.ts";
import { SpiColumnComment } from "./executors/types/spi_column_comment.ts";

export interface IConnectionOperations {
  /* Internal Sql Operations*/
  createSchema(scd: SpiCreateSchema): string;
  dropSchema(scd: SpiDropSchema): string;
  columnDefinition(scd: SpiColumnDefinition): string;
  columnComment(scd: SpiColumnComment): string;
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
  // getDbColumnType(req: { spitype: string, length?: number, precision?: number, scale?: number }): string;
  getMetadata(): Promise<MetadataStore>;
  getRawOne(query: string): Promise<Array<any>>;
  getRawMany(query: string): Promise<Array<any>>;
  getRawMultiple(query: string): Promise<Array<any>>;
  /* Returns entities*/
  getOne(query: string): Promise<any>;
  getMany(query: string): Promise<Array<any>>;
  execute(query: string): Promise<any>;
}
