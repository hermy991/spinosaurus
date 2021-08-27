import { BuilderBase } from "./base/builder_base.ts";
import { ParamUpdateSet } from "./params/param_update.ts";
import { ConnectionAll } from "../connection_type.ts";

export class BuilderUpdate extends BuilderBase {
  #options: { autoUpdate?: boolean; updateWithoutPrimaryKey?: boolean } = {
    autoUpdate: true,
    updateWithoutPrimaryKey: false,
  };
  #entityData: { entity: string; schema?: string } | Function | null = null;
  #setData: ParamUpdateSet[] = [];
  #whereData: Array<string> = [];

  constructor(public conn: ConnectionAll) {
    super(conn);
  }

  update(
    req:
      | { entity: string; schema?: string }
      | {
        entity: Function;
        options?: { autoUpdate?: boolean; updateWithoutPrimaryKey?: boolean };
      }
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

  set(data: ParamUpdateSet[] | ParamUpdateSet) {
    this.#setData = [];
    this.addSet(data);
  }

  addSet(data: ParamUpdateSet[] | ParamUpdateSet) {
    data = Array.isArray(data) ? data : [data];
    this.#setData.push(...data);
  }

  where(
    conditions: [string, ...string[]],
    params?: { [x: string]: string | number | Date },
  ) {
    this.#whereData = [];
    this.addWhere(conditions, params);
  }

  addWhere(
    conditions: [string, ...string[]],
    params?: { [x: string]: string | number | Date },
  ) {
    this.#whereData.push(...this.conn.interpolate(conditions, params));
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
    if (addings.length && this.#whereData.length) {
      sql.push(`${addings.join(" ")} AND ( ${this.#whereData.join(" ")} )`);
    } else {
      sql = [...sql, `${addings.join(" ")}`, `${this.#whereData.join(" ")}`];
    }
    return sql.join(" ");
  }

  getEntitySetQuery(
    e: { schema?: string; entity?: string },
    set: ParamUpdateSet,
    ps: Array<any> = [],
  ) {
    if (!set) {
      return ``;
    }
    let primaryColumn: { name: string; value: any } | undefined;
    const sqls: string[] = [this.getEntityQuery(e)];
    const columns: string[] = [];
    const addings: string[] = [];
    let cloned: ParamUpdateSet = {};
    if (!ps.length) {
      cloned = set;
    } else {
      for (const name in set) {
        for (const p of ps) {
          if (p.propertyKey === name) {
            if (p.update) {
              cloned[p.name] = set[name];
            }
            if (p.primary) {
              primaryColumn = { name: p.name, value: set[name] };
              addings.push(
                `${this.clearNames(p.name)} = ${
                  this.conn.stringify(set[name])
                }`,
              );
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
          cloned[p.name] = p.autoUpdate;
        }
      }
    }
    for (const dbname in cloned) {
      const tempStr = `${this.clearNames(dbname)} = ${
        this.conn.stringify(cloned[dbname])
      }`;
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

  getSql() {
    if (!this.#entityData) {
      return "";
    }
    const sqls: string[] = [];
    let e: { schema?: string; entity?: string } = {};
    let ps = [];
    if (this.#entityData instanceof Function) {
      e = this.getEntityData(this.conn.options.name, this.#entityData);
      ps = this.getColumnAccesors(this.conn.options.name, this.#entityData);
    } else {
      e = <any> this.#entityData;
    }
    for (const set of this.#setData) {
      const sql = `${this.getEntitySetQuery(e, set, ps)}`;
      if (sql) {
        sqls.push(sql);
      }
    }
    return sqls.join(";");
  }
}
