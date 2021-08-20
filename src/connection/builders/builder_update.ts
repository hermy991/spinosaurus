import { interpolate, stringify } from "./base/sql.ts";
import { BuilderBase } from "./base/builder_base.ts";
import { ConnectionAll } from "../connection_type.ts";

export class BuilderUpdate extends BuilderBase {
  #entityData: { entity: string; schema?: string } | Function | null = null;
  #setData: Array<{ [x: string]: string | number | Date | Function | null }> =
    [];
  #whereData: Array<string> = [];

  constructor(public conn: ConnectionAll) {
    super(conn);
  }

  update(
    req: { entity: string; schema?: string } | [string, string?] | Function,
  ): void {
    if (Array.isArray(req)) {
      const [entity, schema] = req;
      this.#entityData = { entity, schema };
    } else {
      this.#entityData = req;
    }
  }

  set(
    ...entities: Array<
      { [x: string]: string | number | Date | Function | null }
    >
  ) {
    this.#setData = [];
    entities.forEach((x) => this.addSet(x));
  }

  addSet(
    columns: { [x: string]: string | number | Date | Function | null },
  ) {
    this.#setData.push(columns);
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
    this.#whereData.push(...interpolate(conditions, params));
  }

  getEntityQuery(e: { schema?: string; entity?: string }) {
    const query = `${this.clearNames([e.schema, e.entity])}`;
    return `UPDATE ${query}`;
  }

  getWhereQuery(addings: string[] = []) {
    if (!this.#whereData.length) {
      return ``;
    }
    const conditions: string[] = [];
    for (let i = 0; i < this.#whereData.length; i++) {
      const tempWhere = this.#whereData[i];
      conditions.push(tempWhere);
    }

    if (addings.length) {
      return `WHERE ${addings.join(" ")} AND ( ${conditions.join(" ")} )`;
    }
    return `WHERE ${conditions.join(" ")}`;
  }

  getEntitySetQuery(
    e: { schema?: string; entity?: string },
    set: { [x: string]: string | number | Date | Function | null },
    ps: Array<any> = [],
  ) {
    if (!set) {
      return ``;
    }
    const sqls: string[] = [this.getEntityQuery(e)];
    const columns: string[] = [];
    const addins: string[] = [];
    const cloned = self.structuredClone(set);
    for (const p of ps) {
    }

    for (const name in cloned) {
      const tempStr = `${this.clearNames(name)} = ${stringify(cloned[name])}`;
      columns.push(tempStr);
    }
    if (!columns.length) {
      return ``;
    }
    sqls.push(`SET ${columns.join(", ")}`);
    const where = this.getWhereQuery(addins);
    if (where) {
      sqls.push(where);
    }
    return sqls.join("\n");
  }

  getQuery() {
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
      sqls.push(sql);
    }
    return sqls.join(";");
  }
}
