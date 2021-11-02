import { BuilderBase } from "./base/builder_base.ts";
import { ParamUpdateEntity, ParamUpdateOptions, ParamUpdateParams, ParamUpdateSet } from "./params/param_update.ts";
import { Driver } from "../connection_type.ts";
import { findColumn, findPrimaryColumn } from "../../stores/store.ts";

export class BuilderUpdate<T> extends BuilderBase {
  #options: ParamUpdateOptions = {
    autoUpdate: true,
    updateWithoutPrimaryKey: false,
  };
  #entityData: { entity: string; schema?: string } | Function | null = null;
  #setData: ParamUpdateSet<T>[] = [];
  #whereData: Array<string> = [];
  #paramsData: ParamUpdateParams = {};

  constructor(public conn: Driver) {
    super(conn);
  }

  update(req: ParamUpdateEntity): void {
    if (Array.isArray(req)) {
      const [entity, schema] = req;
      this.#entityData = { entity, schema };
    } else if (typeof req === "function") {
      this.#entityData = req;
    } else if (req.entity instanceof Function) {
      this.#entityData = req.entity;
      this.#options = { ...this.#options, ...((<any> req).options || {}) };
    } else {
      this.#entityData = <any> req;
    }
  }

  set<T>(data: ParamUpdateSet<T>[] | ParamUpdateSet<T>) {
    this.#setData = [];
    this.addSet(data);
  }

  addSet<T>(data: ParamUpdateSet<T>[] | ParamUpdateSet<T>) {
    data = Array.isArray(data) ? data : [data];
    data.forEach((d) => this.#setData.push(<T> d));
  }

  where(
    conditions: [string, ...string[]] | string,
    params?: ParamUpdateParams,
  ) {
    this.#whereData = [];
    this.addWhere(conditions, params);
  }

  andWhere(
    conditions: [string, ...string[]] | string,
    params?: ParamUpdateParams,
  ) {
    let tconditions = self.structuredClone(conditions);
    if (Array.isArray(tconditions)) {
      for (let i = 0; i < tconditions.length; i++) {
        tconditions[i] = `AND ${tconditions[i]}`;
      }
    } else tconditions = `AND ${tconditions}`;
    this.addWhere(tconditions, params);
  }

  orWhere(
    conditions: [string, ...string[]] | string,
    params?: ParamUpdateParams,
  ) {
    let tconditions = self.structuredClone(conditions);
    if (Array.isArray(tconditions)) {
      for (let i = 0; i < tconditions.length; i++) {
        tconditions[i] = `OR ${tconditions[i]}`;
      }
    } else tconditions = `OR ${tconditions}`;
    this.addWhere(tconditions, params);
  }

  addWhere(
    conditions: [string, ...string[]] | string,
    params?: ParamUpdateParams,
  ) {
    this.#whereData.push(
      ...(Array.isArray(conditions) ? conditions : [conditions]),
    );
    if (params) {
      this.addParams(params);
    }
  }

  params(options?: ParamUpdateParams): void {
    this.#paramsData = {};
    if (options) {
      this.addParams(options);
    }
  }

  addParams(options: ParamUpdateParams): void {
    this.#paramsData = { ...this.#paramsData, ...options };
  }

  getEntityQuery(e: { schema?: string; entity?: string }) {
    const query = `${this.clearNames([e.schema, e.entity])}`;
    return `UPDATE ${query}`;
  }

  getWhereQuery(addings: string[] = []) {
    if (!this.#whereData.length && !addings.length) {
      return ``;
    }
    let sql: string[] = [];
    sql.push(`WHERE`);
    const conditions: string[] = this.conn.interpolate(
      <[string, ...string[]]> this.#whereData,
      this.#paramsData,
    );
    if (addings.length && conditions.length) {
      sql.push(`${addings.join(" ")} AND ( ${conditions.join(" ")} )`);
    } else {
      sql = [...sql, `${addings.join(" ")}`, `${conditions.join(" ")}`].filter((x) => x);
    }
    return sql.join(" ");
  }

  getEntitySetQuery<T>(
    e: { schema?: string; entity?: string; classFunction?: Function },
    set: ParamUpdateSet<T>,
    ps: Array<any> = [],
  ) {
    if (!set) {
      return ``;
    }
    let primaryColumn: { name: string; value: any } | undefined;
    const sqls: string[] = [this.getEntityQuery(e)];
    const columns: string[] = [];
    const addings: string[] = [];
    let cloned: ParamUpdateSet<T> = {};
    if (!ps.length) {
      cloned = set;
    } else {
      for (const name in set) {
        for (const p of ps) {
          if (p.propertyKey === name) {
            if (
              p.update && typeof (<any> set)[name] === "object" && !((<any> set)[name] instanceof Date) &&
              (<any> set)[name] !== null &&
              !Array.isArray((<any> set)[name])
            ) {
              let xc = findColumn({
                entityOrClass: <Function> e.classFunction,
                propertyKey: p.propertyKey,
                nameOrOptions: this.conn.options,
              });
              let fc = findPrimaryColumn({ entityOrClass: p.type, nameOrOptions: this.conn.options });
              if (xc && xc.length === 2 && fc && fc.length === 2 && fc[1].propertyKey in (<any> set)[name]) {
                (<any> cloned)[xc[1].foreign.columnName] = (<any> set)[name][fc[1].propertyKey];
              }
            } else if (p.update) {
              (<any> cloned)[p.name] = (<any> set)[name];
            }
            if (p.primary) {
              primaryColumn = { name: p.name, value: (<any> set)[name] };
              addings.push(`${this.clearNames(p.name)} = ${this.conn.stringify((<any> set)[name])}`);
            }
          }
        }
      }
      if (!primaryColumn && !this.#options.updateWithoutPrimaryKey) {
        return ``;
      }
      for (
        const p of ps.filter((x) => x.autoUpdate && this.#options.autoUpdate)
      ) {
        if (!(p.name in cloned)) {
          (<any> cloned)[p.name] = p.autoUpdate;
        }
      }
    }
    for (const dbname in cloned) {
      const tempStr = `${this.clearNames(dbname)} = ${this.conn.stringify((<any> cloned)[dbname])}`;
      columns.push(tempStr);
    }
    if (!columns.length) {
      return ``;
    }
    sqls.push(`SET ${columns.join(", ")}`);
    const where = this.getWhereQuery(addings);
    if (where) {
      sqls.push(where);
    }
    return sqls.join(" ");
  }

  getSqls(): string[] {
    if (!this.#entityData) {
      return [];
    }
    const sqls: string[] = [];
    let e: { schema?: string; entity?: string; classFunction?: Function } = {};
    let ps = [];
    if (this.#entityData instanceof Function) {
      e = this.getEntityData(this.conn.options.name, this.#entityData);
      e.classFunction = this.#entityData;
      ps = this.getColumns(this.conn.options.name, this.#entityData);
    } else {
      e = this.#entityData;
    }
    for (const set of this.#setData) {
      const sql = this.getEntitySetQuery(e, set, ps);
      if (sql) {
        sqls.push(sql);
      }
    }
    return sqls;
  }
}
