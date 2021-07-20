import { clearNames, stringify } from "../../tools/sql.ts";
import { BaseBuilding } from "../../base_building.ts";
import { SpiColumnDefinition } from "../../../connection/executors/types/spi_column_definition.ts";
// import { SpiColumnComment } from "../../../connection/executors/types/spi_column_comment.ts";

export class AlterBuilding extends BaseBuilding {
  private fromData: { entity: string; schema?: string } | undefined = undefined;
  private columnsData: Array<
    [string, SpiColumnDefinition] | SpiColumnDefinition
  > = [];

  constructor(
    public conf: { delimiters: [string, string?] } = { delimiters: [`"`] },
    public transformer: { columnAlter?: Function; columnComment?: Function } =
      {},
  ) {
    super(conf);
  }

  alter(from: { entity: string; schema?: string }): void {
    this.fromData = from;
  }

  columns(
    ...columns: Array<[string, SpiColumnDefinition] | SpiColumnDefinition>
  ): void {
    this.columnsData = [];
    columns.forEach((x) => {
      this.addColumn(x);
    });
  }

  addColumn(column: [string, SpiColumnDefinition] | SpiColumnDefinition): void {
    this.columnsData.push(column);
  }

  // getEntityQuery(): string {
  //   if (!this.fromData) {
  //     return ``;
  //   }
  //   const [entity, schema] = this.fromData;
  //   const query = clearNames({
  //     left: this.left,
  //     identifiers: [schema, entity],
  //     right: this.right,
  //   });
  //   return `ALTER TABLE ${query}`;
  // }

  getColumnsQuery(): string {
    if (!this.columnsData.length || !this.fromData) {
      return ``;
    }
    let { entity, schema } = this.fromData;
    entity = entity
      ? clearNames({ left: this.left, identifiers: entity, right: this.right })
      : entity;
    schema = schema
      ? clearNames({ left: this.left, identifiers: schema, right: this.right })
      : schema;

    let querys: string[] = [];

    for (let i = 0; i < this.columnsData.length; i++) {
      let columnName = "", def: SpiColumnDefinition;
      if (Array.isArray(this.columnsData[i])) {
        [columnName, def] = <[string, SpiColumnDefinition]> this.columnsData[i];
      } else {
        def = <SpiColumnDefinition> this.columnsData[i];
      }
      columnName = columnName
        ? clearNames({
          left: this.left,
          identifiers: columnName,
          right: this.right,
        })
        : columnName;
      def.columnName = def.columnName
        ? clearNames({
          left: this.left,
          identifiers: def.columnName,
          right: this.right,
        })
        : def.columnName;

      if (this.transformer.columnAlter) {
        querys = [
          ...querys,
          ...this.transformer.columnAlter({ schema, entity, columnName }, def),
        ];
      }
      if (def.comment && this.transformer.columnComment) {
        querys.push(
          this.transformer.columnComment({
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
