import { BuilderBase } from "./base/builder_base.ts";
import { SpiColumnDefinition } from "../executors/types/spi_column_definition.ts";
import { SpiRelationDefinition } from "../executors/types/spi_relation_definition.ts";
import { SpiColumnAdjust } from "../executors/types/spi_column_adjust.ts";
import { ConnectionAll } from "../connection_type.ts";
import {
  linkMetadataToColumnAccesors,
  linkMetadataToFromData,
} from "../../decorators/metadata/metadata.ts";

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
    let { entity, schema } = this.#nameData;
    for (let i = 0; i < this.#relationsData.length; i++) {
      let sql = "";
      let constraintName = Array.isArray(this.#relationsData[i])
        ? (<[string, any]> this.#relationsData[i])[0]
        : undefined;
      const rd = Array.isArray(this.#relationsData[i])
        ? (<[string, any]> this.#relationsData[i])[1]
        : this.#relationsData[i];

      let { name, columns, parentSchema, parentEntity, parentColumns } = rd;
      if (parentColumns) {
        parentColumns = parentColumns.filter((x: any) => x);
      }
      if (parentEntity instanceof Function) {
        const r = linkMetadataToFromData({
          connName: (<any> this.conn.options).name,
          entity: parentEntity,
        });
        // console.log("r: ", r);
        // console.log("(<any> this.conn): ", <any> this.conn);
        // console.log(`relations[${i}]: `, this.#relationsData[i]);
        if (!parentColumns?.length) {
          parentColumns = linkMetadataToColumnAccesors({
            currentSquema: "",
            connName: (<any> this.conn).name,
          }, parentEntity)
            .filter((x: any) => x.primary)
            .map((x: any) => x.name);
        }
        parentSchema = r.schema;
        parentEntity = r.entity;
      }
      name ||= constraintName;
      name ||= this.generateName1({
        prefix: "FK",
        schema,
        entity,
        name: parentEntity,
        sequence: i + 1,
      });
      if (constraintName) {
        // Dropping constraints
        constraintName = this.clearNames(constraintName);
        sql = this.conn.dropConstraint({
          entity: this.clearNames([schema, entity]),
          name: constraintName,
        });
        sqls.push(sql);
      }
      schema = this.clearNames(schema);
      entity = this.clearNames(entity);
      name = this.clearNames(name);
      parentSchema = this.clearNames(parentSchema);
      parentEntity = this.clearNames(parentEntity);
      columns = columns.map((x: string) => this.clearNames(x));
      if (!parentColumns?.length) {
        parentColumns = self.structuredClone(columns);
      } else {
        parentColumns = parentColumns.map((x: string) => this.clearNames(x));
      }
      sql = this.conn.createRelation({
        schema,
        entity,
        name,
        columns,
        parentSchema,
        parentEntity,
        parentColumns,
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
