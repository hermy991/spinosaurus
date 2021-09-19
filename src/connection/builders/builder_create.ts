import { ParamColumnDefinition } from "./params/param_column.ts";
import { ParamCheck } from "./params/param_check.ts";
import { ParamUnique } from "./params/param_unique.ts";
import { ParamRelationCreate } from "./params/param_relation.ts";
import {
  ParamCreateAfter,
  ParamCreateData,
  ParamCreateEntity,
  ParamCreateNext,
  ParamCreateOptions,
} from "./params/param_create.ts";
import { ConnectionAll } from "../connection_type.ts";
import { BuilderBase } from "./base/builder_base.ts";
import { BuilderAlter } from "./builder_alter.ts";
import { BuilderInsert } from "./builder_insert.ts";

export class BuilderCreate extends BuilderBase {
  #options: ParamCreateOptions = {
    createByEntity: false,
    autoGeneratePrimaryKey: true,
  };
  #entityData:
    | { entity: string; schema?: string }
    | { schema: string; check?: boolean }
    | Function
    | null = null;
  #columnsData: ParamColumnDefinition[] = [];
  #checkData: ParamCheck[] = [];
  #uniquesData: { name?: string; columns: string[] }[] = [];
  #relationsData: ParamRelationCreate[] = [];
  #initData: ParamCreateData[] = [];
  #nextData: ParamCreateNext[] = [];
  #afterData: ParamCreateAfter[] = [];
  constructor(public conn: ConnectionAll) {
    super(conn);
  }

  create(req: ParamCreateEntity): void {
    if (req instanceof Function) {
      this.#entityData = <any> req;
    } else if (typeof (<any> req).entity === "function") {
      this.#entityData = (<any> req).entity;
      this.#options = { ...this.#options, ...((<any> req).options || {}) };
    } else {
      this.#entityData = <any> req;
      this.#options = { ...this.#options, ...((<any> req).options || {}) };
    }
  }

  columns(columns: Array<ParamColumnDefinition>): void {
    this.#columnsData = [];
    columns.forEach((x) => {
      this.addColumn(x);
    });
  }

  addColumn(column: ParamColumnDefinition): void {
    column.name = `${column.name}`;
    this.#columnsData.push(column);
  }

  checks(checks: Array<ParamCheck>): void {
    this.#checkData = [];
    checks.forEach((x) => {
      this.addCheck(x);
    });
  }

  addCheck(check: ParamCheck): void {
    this.#checkData.push(check);
  }

  uniques(uniques: Array<ParamUnique>): void {
    this.#uniquesData = [];
    uniques.forEach((x) => {
      this.addUnique(x);
    });
  }

  addUnique(unique: ParamUnique): void {
    this.#uniquesData.push(unique);
  }

  relations(relations: Array<ParamRelationCreate>): void {
    this.#relationsData = [];
    relations.forEach((x) => {
      this.addRelation(x);
    });
  }

  addRelation(relation: ParamRelationCreate): void {
    this.#relationsData.push(relation);
  }

  data(data: ParamCreateData[] | ParamCreateData) {
    this.#initData = [];
    this.addData(data);
  }

  addData(data: ParamCreateData[] | ParamCreateData) {
    data = Array.isArray(data) ? data : [data];
    this.#initData.push(...data);
  }

  next(sqls: ParamCreateNext[] | ParamCreateNext) {
    this.#nextData = [];
    this.addNext(sqls);
  }

  addNext(sqls: ParamCreateNext[] | ParamCreateNext) {
    sqls = Array.isArray(sqls) ? sqls : [sqls];
    this.#nextData.push(...sqls);
  }

  after(sqls: ParamCreateAfter[] | ParamCreateAfter) {
    this.#afterData = [];
    this.addAfter(sqls);
  }

  addAfter(sqls: ParamCreateAfter[] | ParamCreateAfter) {
    sqls = Array.isArray(sqls) ? sqls : [sqls];
    this.#afterData.push(...sqls);
  }

  getCreateSchemaQuery(): string[] {
    if (!this.#entityData || this.#entityData instanceof Function) {
      return [];
    }
    const nameData = self.structuredClone(this.#entityData);
    nameData.schema = this.clearNames(nameData.schema);
    return [this.conn.createSchema(nameData)];
  }

  getCreateTableQuery(e: { schema?: string; entity?: string }): string {
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

  getColumnsQuery(cols: Array<ParamColumnDefinition> = []): string {
    if (!cols.length) {
      return ``;
    }
    const sqls: string[] = [];
    for (let i = 0; i < cols.length; i++) {
      const name = this.clearNames(cols[i].name);
      const sql = this.conn.columnDefinition({ ...cols[i], name });
      sqls.push(sql);
    }
    return `( ${sqls.join(", ")} )`;
  }

  getChecksQuery(
    e: { schema?: string; entity?: string },
    chks: ParamCheck[],
  ): string[] {
    if (!chks.length) {
      return [];
    }
    const sqls: string[] = [];
    const { schema, entity } = e;
    const tchks: ParamCheck[] = chks;
    for (let i = 0; i < tchks.length; i++) {
      tchks[i].name ||= this.generateName1({
        prefix: "CHK",
        ...e,
        sequence: i + 1,
      });
      tchks[i].name = this.clearNames(tchks[i].name);
      const sql = this.conn.createCheck({
        entity: entity && this.clearNames(entity),
        schema: schema && this.clearNames(schema),
        ...tchks[i],
      });
      sqls.push(sql);
    }
    return sqls;
  }

  getUniquesQuery(e: { schema?: string; entity?: string }): string[] {
    if (!this.#uniquesData.length) {
      return [];
    }
    const sqls: string[] = [];
    const { schema, entity } = e;

    for (let i = 0; i < this.#uniquesData.length; i++) {
      const unique = self.structuredClone(this.#uniquesData[i]);
      unique.name ||= this.generateName1({
        prefix: "UQ",
        schema,
        entity,
        sequence: i + 1,
      });
      unique.name = this.clearNames(unique.name);
      unique.columns = unique.columns.map((x: string) => this.clearNames(x));
      const sql = this.conn.createUnique({
        entity: entity && this.clearNames(entity),
        schema: schema && this.clearNames(schema),
        ...unique,
      });
      sqls.push(sql);
    }
    return sqls;
  }

  getRelationsQuery(e: { schema?: string; entity?: string }): string[] {
    if (!this.#relationsData.length) {
      return [];
    }
    const ba = new BuilderAlter(this.conn);
    ba.alter(<any> e);
    ba.relations(this.#relationsData);
    return ba.getSqls();
  }

  getInsertsQuery(
    e: { schema?: string; entity?: string },
    cols: Array<ParamColumnDefinition>,
  ): string[] {
    if (!e.entity) {
      return [];
    }
    const ib = new BuilderInsert(this.conn);
    if (this.#entityData instanceof Function) {
      ib.insert({
        entity: this.#entityData,
        options: { ...this.#options },
      });
      ib.values(this.#initData);
    } else {
      ib.insert(<any> e);
      for (const create of this.#initData) {
        const tcreate: ParamCreateData = {};
        for (const c of cols) {
          if (c.name in create) {
            if (!c.autoIncrement) {
              tcreate[c.name] = create[c.name];
            } else if (
              !(c.primary && c.autoIncrement) ||
              !this.#options.autoGeneratePrimaryKey
            ) {
              tcreate[c.name] = create[c.name];
            }
          }
        }
        ib.addValues(tcreate);
      }
    }
    return ib.getSqls();
  }

  getNextQuery(): string[] {
    return this.#nextData.flatMap((x) => x)
      .map((x) => x.trim())
      .map((x) => x.lastIndexOf(";") === x.length - 1 ? x.substring(0, x.length - 1) : x)
      .filter((x) => x);
  }

  getAfterQuery(): string[] {
    return this.#afterData.flatMap((x) => x)
      .map((x) => x.trim())
      .map((x) => x.lastIndexOf(";") === x.length - 1 ? x.substring(0, x.length - 1) : x)
      .filter((x) => x);
  }

  getSqls(): string[] {
    if (!this.#entityData) {
      return [];
    }
    if ("schema" in this.#entityData && !("entity" in this.#entityData)) {
      return this.getCreateSchemaQuery();
    }
    const sqls = [];
    let e: { schema?: string; entity?: string } = {};
    let cols: ParamColumnDefinition[] = this.#columnsData;
    let chks: ParamCheck[] = self.structuredClone(this.#checkData);
    if (this.#entityData instanceof Function) {
      e = this.getEntityData(this.conn.options.name, this.#entityData);
      if (this.#options.createByEntity) {
        cols = cols.length ? cols : this.getColumns(this.conn.options.name, this.#entityData);
        chks = chks.length ? chks : this.getChecks(this.conn.options.name, this.#entityData);
      }
    } else {
      e = this.#entityData;
    }
    if (cols.length) {
      sqls.push(this.getCreateTableQuery(e) + " " + this.getColumnsQuery(cols));
    }
    if (chks.length) {
      sqls.push(...this.getChecksQuery(e, chks));
    }
    if (this.#uniquesData.length) {
      sqls.push(...this.getUniquesQuery(e));
    }
    if (this.#relationsData.length) {
      sqls.push(...this.getRelationsQuery(e));
    }
    if (this.#initData.length) {
      sqls.push(...this.getInsertsQuery(e, cols));
    }
    if (this.#nextData.length) {
      sqls.push(...this.getNextQuery());
    }
    if (this.#afterData.length) {
      sqls.push(...this.getAfterQuery());
    }
    return sqls;
  }
}
