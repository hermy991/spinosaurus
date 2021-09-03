import { BuilderBase } from "./base/builder_base.ts";
import { ParamInsertValue } from "./params/param_insert.ts";
import { ConnectionAll } from "../connection_type.ts";

export class BuilderInsert extends BuilderBase {
  #options: { autoInsert?: boolean } = { autoInsert: true };
  #entityData: { entity: string; schema?: string } | Function | null = null;
  #valuesData: ParamInsertValue[] = [];

  constructor(public conn: ConnectionAll) {
    super(conn);
  }

  insert(
    req:
      | { entity: string; schema?: string }
      | { entity: Function; options?: { autoInsert?: boolean } }
      | [string, string?]
      | Function,
  ): void {
    if (Array.isArray(req)) {
      const [entity, schema] = req;
      this.#entityData = { entity, schema };
    } else if (typeof req === "function") {
      this.#entityData = req;
    } else if (req.entity instanceof Function) {
      this.#entityData = req.entity;
      this.#options = (<any> req).options || {};
    } else {
      this.#entityData = <any> req;
    }
  }

  values(data: ParamInsertValue[] | ParamInsertValue) {
    this.#valuesData = [];
    this.addValues(data);
  }

  addValues(data: ParamInsertValue[] | ParamInsertValue) {
    data = Array.isArray(data) ? data : [data];
    this.#valuesData.push(...data);
  }

  getEntityQuery(e: { schema?: string; entity?: string }) {
    const query = `${this.clearNames([e.schema, e.entity])}`;
    return `INSERT INTO ${query}`;
  }

  getColumnsQuery(keys: Array<string>) {
    if (!this.#valuesData.length) {
      return ``;
    }
    const columns: Set<string> = new Set();
    keys.forEach((key) => columns.add(this.clearNames(key)));
    return `(${[...columns].join(", ")})`;
  }
  getValuesQuery(
    values: Array<
      string | number | boolean | Date | Function | null | undefined
    >,
  ) {
    return `VALUES (${values.map((v) => this.conn.stringify(v)).join(", ")})`;
  }

  getEntityValueQuery(
    e: { schema?: string; entity?: string },
    value: ParamInsertValue,
    ps: Array<any> = [],
  ): string {
    if (!value) {
      return ``;
    }
    let primaryGeneratedColumn: {
      name: string;
      value: any;
      autoIncrement: string;
    } | undefined;
    const sqls: string[] = [this.getEntityQuery(e)];
    let cloned: ParamInsertValue = {};
    if (!ps.length) {
      cloned = value;
    } else {
      for (const name in value) {
        for (const p of ps) {
          if (p.propertyKey === name) {
            if (p.insert) {
              cloned[p.name] = value[name];
            }
            if (p.primary && p.autoIncrement) {
              primaryGeneratedColumn = {
                name: p.name,
                value: value[name],
                autoIncrement: p.autoIncrement,
              };
            }
          }
        }
      }
      /*&& !this.#options.updateWithoutPrimaryKey*/
      if (primaryGeneratedColumn) {
        return ``;
      }
      for (
        const p of ps.filter((x) => x.autoInsert && this.#options.autoInsert)
      ) {
        if (!(p.name in cloned)) {
          cloned[p.name] = p.autoInsert;
        }
      }
    }
    if (!Object.keys(cloned).length) {
      return ``;
    }
    Object.values(cloned);
    sqls.push(this.getColumnsQuery(Object.keys(cloned)));
    sqls.push(this.getValuesQuery(Object.values(cloned)));
    return sqls.join(" ");
  }
  getSqls(): string[] {
    if (!this.#entityData) {
      return [];
    }
    const sqls: string[] = [];
    let e: { schema?: string; entity?: string } = {};
    let ps = [];
    if (this.#entityData instanceof Function) {
      e = this.getEntityData(this.conn.options.name, this.#entityData);
      ps = this.getColumns(this.conn.options.name, this.#entityData);
    } else {
      e = this.#entityData;
    }
    for (const value of this.#valuesData) {
      const sql = `${this.getEntityValueQuery(e, value, ps)}`;
      if (sql) {
        sqls.push(sql);
      }
    }
    return sqls;
  }
}
