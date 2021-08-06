import { BuilderBase } from "./base/builder_base.ts";
import { SpiColumnDefinition } from "../executors/types/spi_column_definition.ts";
import { SpiColumnAdjust } from "../executors/types/spi_column_adjust.ts";
import { ConnectionAll } from "../connection_type.ts";

export class BuilderAlter extends BuilderBase {
  private fromData: { entity: string; schema?: string } | undefined = undefined;
  private columnsData: Array<
    [string, SpiColumnAdjust] | SpiColumnDefinition
  > = [];

  constructor(public conn: ConnectionAll) {
    super(conn);
  }

  alter(from: { entity: string; schema?: string }): void {
    this.fromData = from;
  }

  columns(
    ...columns: Array<[string, SpiColumnAdjust] | SpiColumnDefinition>
  ): void {
    this.columnsData = [];
    columns.forEach((x) => {
      this.addColumn(x);
    });
  }

  addColumn(column: [string, SpiColumnAdjust] | SpiColumnDefinition): void {
    this.columnsData.push(column);
  }

  getColumnsQuery(): string {
    if (!this.columnsData.length || !this.fromData) {
      return ``;
    }
    let { entity, schema } = this.fromData;
    entity = entity ? this.clearNames(entity) : entity;
    schema = schema ? this.clearNames(schema) : schema;

    let querys: string[] = [];

    for (let i = 0; i < this.columnsData.length; i++) {
      let columnName = "", def: SpiColumnAdjust | SpiColumnDefinition;
      if (Array.isArray(this.columnsData[i])) {
        [columnName, def] = <[string, SpiColumnAdjust]> this.columnsData[i];
      } else {
        def = <SpiColumnDefinition> this.columnsData[i];
      }
      columnName = columnName ? this.clearNames(columnName) : columnName;
      def.columnName = def.columnName
        ? this.clearNames(def.columnName)
        : def.columnName;

      querys = [
        ...querys,
        ...this.conn.columnAlter({ schema, entity, columnName }, def),
      ];
      if (def.comment) {
        querys.push(
          this.conn.columnComment({
            schema,
            entity,
            columnName: def.columnName || columnName,
            comment: def.comment,
          }),
        );
      }

      /**
       * COLLATION
       * MYSQL
       *   ALTER TABLE <table_name> MODIFY <column_name> VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
       * SQL SERVER
       *   ALTER TABLE dbo.MyTable ALTER COLUMN CharCol VARCHAR(50) COLLATE Latin1_General_100_CI_AI_SC_UTF8
       * POSTGRES
       *   ALTER TABLE users ALTER COLUMN name TYPE character varying(255) COLLATE "en_US"
       */
    }
    return `${querys.join(";\n")}`;
  }

  getQuery(): string {
    const query = `${this.getColumnsQuery()}`;
    return query;
  }
}
