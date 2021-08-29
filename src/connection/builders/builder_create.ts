import { ParamColumnDefinition } from "./params/param_column.ts";
import { ParamCheck } from "./params/param_check.ts";
import { ParamUnique } from "./params/param_unique.ts";
import { ParamRelationCreate } from "./params/param_relation.ts";
import { ParamCreateData } from "./params/param_create.ts";
import { ConnectionAll } from "../connection_type.ts";
import { BuilderBase } from "./base/builder_base.ts";
import { BuilderAlter } from "./builder_alter.ts";
import { BuilderInsert } from "./builder_insert.ts";

export class BuilderCreate extends BuilderBase {
  #entityData:
    | { entity: string; schema?: string }
    | { schema: string; check?: boolean }
    | Function
    | null = null;
  #columnsData: Array<ParamColumnDefinition> = [];
  #checkData: Array<ParamCheck> = [];
  #uniquesData: Array<{ name?: string; columns: Array<string> }> = [];
  #relationsData: Array<ParamRelationCreate> = [];
  #createData: Array<ParamCreateData> = [];
  constructor(public conn: ConnectionAll) {
    super(conn);
  }

  create(
    req: { entity: string; schema?: string } | {
      schema: string;
      check?: boolean;
    } | Function,
  ): void {
    this.#entityData = req;
  }

  columns(...columns: Array<ParamColumnDefinition>): void {
    this.#columnsData = [];
    columns.forEach((x) => {
      this.addColumn(x);
    });
  }

  addColumn(column: ParamColumnDefinition): void {
    column.name = `${column.name}`;
    this.#columnsData.push(column);
  }

  checks(...checks: Array<ParamCheck>): void {
    this.#checkData = [];
    checks.forEach((x) => {
      this.addCheck(x);
    });
  }

  addCheck(check: ParamCheck): void {
    this.#checkData.push(check);
  }

  uniques(...uniques: Array<ParamUnique>): void {
    this.#uniquesData = [];
    uniques.forEach((x) => {
      this.addUnique(x);
    });
  }

  addUnique(unique: ParamUnique): void {
    this.#uniquesData.push(unique);
  }

  relations(...relations: Array<ParamRelationCreate>): void {
    this.#relationsData = [];
    relations.forEach((x) => {
      this.addRelation(x);
    });
  }

  addRelation(relation: ParamRelationCreate): void {
    this.#relationsData.push(relation);
  }

  data(data: ParamCreateData[] | ParamCreateData) {
    this.#createData = [];
    this.addData(data);
  }

  addData(data: ParamCreateData[] | ParamCreateData) {
    data = Array.isArray(data) ? data : [data];
    this.#createData.push(...data);
  }

  getCreateSchemaQuery() {
    if (!this.#entityData) {
      return ``;
    }
    const nameData = self.structuredClone(this.#entityData);
    nameData.schema = this.clearNames(nameData.schema);
    return this.conn.createSchema(nameData);
  }

  getCreateTableQuery(e: { schema?: string; entity?: string }) {
    if (!e.entity) {
      return ``;
    }
    let entity = undefined;
    if ("entity" in e) {
      entity = e.entity;
    }
    const { schema } = e;
    let query = `${this.clearNames(entity)}`;
    if (schema) {
      query = `${this.clearNames([schema, entity])}`;
    }
    return `CREATE TABLE ${query}`;
  }

  getColumnsQuery(cs: Array<ParamColumnDefinition> = []) {
    if (!cs.length) {
      return ``;
    }
    const sqls: string[] = [];
    for (let i = 0; i < cs.length; i++) {
      let sql = "";
      const name = this.clearNames(cs[i].name);
      sql = this.conn.columnDefinition({ ...cs[i], name });
      sqls.push(sql);
    }
    return `( ${sqls.join(", ")} )`;
  }

  getChecksQuery(e: { schema?: string; entity?: string }) {
    if (!this.#checkData.length) {
      return ``;
    }
    const sqls: string[] = [];
    const { schema, entity } = e;

    for (let i = 0; i < this.#checkData.length; i++) {
      let sql = "";
      const name = this.clearNames(
        this.#checkData[i].name ? this.#checkData[i].name : this.generateName1({
          prefix: "CHK",
          ...e,
          sequence: i + 1,
        }),
      );
      sql = this.conn.createCheck({
        entity: this.clearNames([schema, entity]),
        ...this.#checkData[i],
        name,
      });
      sqls.push(sql);
    }
    return `${sqls.join("; ")}`;
  }

  getUniquesQuery(e: { schema?: string; entity?: string }) {
    if (!this.#uniquesData.length) {
      return ``;
    }
    const sqls: string[] = [];
    const { schema, entity } = e;

    for (let i = 0; i < this.#uniquesData.length; i++) {
      let sql = "";
      const unique = self.structuredClone(this.#uniquesData[i]);
      unique.name ||= this.generateName1({
        prefix: "UQ",
        ...e,
        sequence: i + 1,
      });
      unique.name = this.clearNames(unique.name);
      unique.columns = unique.columns.map((x: string) => this.clearNames(x));
      sql = this.conn.createUnique({
        entity: this.clearNames([schema, entity]),
        ...unique,
      });
      sqls.push(sql);
    }
    return `${sqls.join("; ")}`;
  }

  getRelationsQuery(e: { schema?: string; entity?: string }) {
    if (!this.#relationsData.length) {
      return ``;
    }
    const ba = new BuilderAlter(this.conn);
    ba.alter(<any> e);
    ba.relations(...this.#relationsData);
    return ba.getSql();
  }

  getInsertsQuery(
    e: { schema?: string; entity?: string },
    cs: Array<ParamColumnDefinition>,
  ) {
    if (!e.entity) {
      return ``;
    }
    const ib = new BuilderInsert(this.conn);
    ib.insert(<any> e);
    if (this.#entityData instanceof Function) {
      ib.values(this.#createData);
    } else {
      for (const create of this.#createData) {
        const tcreate: ParamCreateData = {};
        for (const c of cs) {
          if (c.name in create) {
            if (!c.autoIncrement) {
              tcreate[c.name] = create[c.name];
            }
          }
        }
        ib.addValues(tcreate);
      }
    }
    return ib.getSql();
  }

  getSql() {
    if (!this.#entityData) {
      return "";
    }
    if ("schema" in this.#entityData && !("entity" in this.#entityData)) {
      return `${this.getCreateSchemaQuery()}`;
    }
    const sqls = [];
    let e: { schema?: string; entity?: string } = {};
    let cs: ParamColumnDefinition[] = [];
    if (this.#entityData instanceof Function) {
      e = this.getEntityData(this.conn.options.name, this.#entityData);
      if (this.#columnsData.length) {
        cs = this.#columnsData;
      } else {
        cs = this.getColumnAccesors(this.conn.options.name, this.#entityData);
      }
    } else {
      e = this.#entityData;
      cs = this.#columnsData;
    }
    if (this.#columnsData.length) {
      sqls.push(this.getCreateTableQuery(e) + " " + this.getColumnsQuery(cs));
    }
    if (this.#checkData.length) {
      sqls.push(this.getChecksQuery(e));
    }
    if (this.#uniquesData.length) {
      sqls.push(this.getUniquesQuery(e));
    }
    if (this.#relationsData.length) {
      sqls.push(this.getRelationsQuery(e));
    }
    if (this.#createData.length) {
      sqls.push(this.getInsertsQuery(e, cs));
    }
    return sqls.join(";\n");
  }
}
