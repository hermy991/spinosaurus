import { BuilderBase } from "./base/builder_base.ts";
import { SpiColumnDefinition } from "../executors/types/spi_column_definition.ts";
import { SpiRelationDefinition } from "../executors/types/spi_relation_definition.ts";
import { SpiColumnAdjust } from "../executors/types/spi_column_adjust.ts";
import { ConnectionAll } from "../connection_type.ts";

export class BuilderAlter extends BuilderBase {
  #nameData: { entity: string; schema?: string } | undefined = undefined;
  #columnsData: Array<[string, SpiColumnAdjust] | SpiColumnDefinition> = [];
  #relationsData: Array<
    [string, SpiRelationDefinition] | SpiRelationDefinition
  > = [];

  constructor(public conn: ConnectionAll) {
    super(conn);
  }

  alter(req: { entity: string; schema?: string }): void {
    this.#nameData = req;
  }

  columns(
    ...columns: Array<[string, SpiColumnAdjust] | SpiColumnDefinition>
  ): void {
    this.#columnsData = [];
    columns.forEach((x) => {
      this.addColumn(x);
    });
  }

  addColumn(column: [string, SpiColumnAdjust] | SpiColumnDefinition): void {
    this.#columnsData.push(column);
  }

  relations(
    ...relations: Array<[string, SpiRelationDefinition] | SpiRelationDefinition>
  ): void {
    this.#relationsData = [];
    relations.forEach((x) => {
      this.addRelation(x);
    });
  }

  addRelation(
    relation: [string, SpiRelationDefinition] | SpiRelationDefinition,
  ): void {
    this.#relationsData.push(relation);
  }

  getColumnsQuery(): string {
    if (!this.#columnsData.length || !this.#nameData) {
      return ``;
    }
    let { entity, schema } = this.#nameData;
    entity = entity ? this.clearNames(entity) : entity;
    schema = schema ? this.clearNames(schema) : schema;

    let querys: string[] = [];

    for (let i = 0; i < this.#columnsData.length; i++) {
      let columnName = "", def: SpiColumnAdjust | SpiColumnDefinition;
      if (Array.isArray(this.#columnsData[i])) {
        [columnName, def] = <[string, SpiColumnAdjust]> this.#columnsData[i];
      } else {
        def = <SpiColumnDefinition> this.#columnsData[i];
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

  getRelationsQuery() {
    if (!this.#relationsData.length || !this.#nameData) {
      return ``;
    }
    const sqls: string[] = [];
    const { entity, schema } = this.#nameData;
    for (let i = 0; i < this.#relationsData.length; i++) {
      let constraintName = Array.isArray(this.#relationsData[i])
        ? (<any> this.#relationsData[i])[0]
        : undefined;
      const options = Array.isArray(this.#relationsData[i])
        ? (<any> this.#relationsData[i])[1]
        : <SpiRelationDefinition> this.#relationsData[i];
      let sql = "";
      constraintName ||= this.generateName1({
        prefix: "FK",
        ...options,
        name: `${options.entity}_${options.columns.join("_")}`,
        sequence: i + 1,
      });
      if (constraintName) {
        // Dropping constraints
        constraintName = this.clearNames(constraintName);
      }
      sql = this.conn.createRelation({
        ...options,
        entity: this.clearNames([schema, entity]),
      });
      sqls.push(sql);
    }
    return `${sqls.join("; ")}`;
  }

  getQuery(): string {
    if (!this.#nameData) {
      return "";
    }
    const querys: string[] = [];
    if (this.#nameData && this.#columnsData.length) {
      querys.push(this.getColumnsQuery());
    }
    if (this.#relationsData.length) {
      querys.push(`${this.getRelationsQuery()}`);
    }
    return querys.join(";\n");
  }
}
