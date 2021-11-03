import { BuilderBase } from "./base/builder_base.ts";
import { ParamColumnAjust, ParamColumnCreate } from "./params/param_column.ts";
import { ParamRelationDefinition } from "./params/param_relation.ts";
import { Driver } from "../connection_type.ts";

export class BuilderAlter extends BuilderBase {
  #nameData: { entity: string; schema?: string } | undefined = undefined;
  #columnsData: Array<[string, ParamColumnAjust] | ParamColumnCreate> = [];
  #relationsData: Array<
    [string, ParamRelationDefinition] | ParamRelationDefinition
  > = [];

  constructor(public driver: Driver) {
    super(driver);
  }

  alter(req: { entity: string; schema?: string }): void {
    this.#nameData = req;
  }

  columns(columns: ([string, ParamColumnAjust] | ParamColumnCreate)[]): void {
    this.#columnsData = [];
    this.addColumns(columns);
  }

  addColumns(
    columns: ([string, ParamColumnAjust] | ParamColumnCreate)[],
  ): void {
    this.#columnsData.push(...columns);
  }

  addColumn(column: [string, ParamColumnAjust] | ParamColumnCreate): void {
    this.#columnsData.push(column);
  }

  relations(
    relations: ([string, ParamRelationDefinition] | ParamRelationDefinition)[],
  ): void {
    this.#relationsData = [];
    this.addRelations(relations);
  }

  addRelations(
    relations: ([string, ParamRelationDefinition] | ParamRelationDefinition)[],
  ): void {
    this.#relationsData.push(...relations);
  }

  addRelation(
    relation: [string, ParamRelationDefinition] | ParamRelationDefinition,
  ): void {
    this.#relationsData.push(relation);
  }

  getColumnsQuery(): string[] {
    if (!this.#columnsData.length || !this.#nameData) {
      return [];
    }
    let { entity, schema } = this.#nameData;
    entity = entity ? this.clearNames(entity) : entity;
    schema = schema ? this.clearNames(schema) : schema;

    let querys: string[] = [];

    for (let i = 0; i < this.#columnsData.length; i++) {
      let name = "", def: ParamColumnAjust | ParamColumnCreate;
      if (Array.isArray(this.#columnsData[i])) {
        [name, def] = <[string, ParamColumnAjust]> this.#columnsData[i];
      } else {
        def = <ParamColumnCreate> this.#columnsData[i];
      }
      name = name ? this.clearNames(name) : name;
      def.name = def.name ? this.clearNames(def.name) : def.name;

      querys = [
        ...querys,
        ...this.driver.columnAlter({ schema, entity, name }, def),
      ];
      if (def.comment) {
        querys.push(
          this.driver.columnComment({
            schema,
            entity,
            name: def.name || name,
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
    return querys;
  }

  getRelationsQuery(): string[] {
    if (!this.#relationsData.length || !this.#nameData) {
      return [];
    }
    const connName = (<any> this.driver.options).name;
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
        const r = this.getEntityData(connName, parentEntity);
        if (!parentColumns?.length) {
          parentColumns = this.getColumns(connName, parentEntity)
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
        sql = this.driver.dropConstraint({
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
      sql = this.driver.createRelation({
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
    return sqls;
  }

  getSqls(): string[] {
    if (!this.#nameData) {
      return [];
    }
    const querys: string[] = [];
    querys.push(...this.getColumnsQuery());
    querys.push(...this.getRelationsQuery());
    return querys;
  }
}
