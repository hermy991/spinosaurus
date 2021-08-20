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

  getEntityQuery() {
    if (!this.#entityData) {
      return ``;
    }
    let e: { schema?: string; entity?: string } = {};
    if (this.#entityData instanceof Function) {
      e = this.getEntityData(this.conn.options.name, this.#entityData);
    } else {
      e = this.#entityData;
    }
    const query = `${this.clearNames([e.schema, e.entity])}`;
    return `UPDATE ${query}`;
  }

  getSetQuery(
    set: { [x: string]: string | number | Date | Function | null },
  ) {
    if (!set) {
      return ``;
    }
    const columns: string[] = [];
    for (const name in set) {
      const tempStr = `${this.clearNames(name)} = ${stringify(set[name])}`;
      columns.push(tempStr);
    }
    if (!columns.length) {
      return ``;
    }
    const querys: string[] = [];
    querys.push(`SET ${columns.join(", ")}`);
    const where = this.getWhereQuery();
    if (where) {
      querys.push(where);
    }
    return querys.join("\n");
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

  getQuery() {
    const querys: string[] = [];
    for (const set of this.#setData) {
      const query = `${this.getEntityQuery()}\n${this.getSetQuery(set)}`;
      // if (this.whereData.length) {
      //   query += `\n${this.getWhereQuery()}`;
      // }
      querys.push(query);
    }
    return querys.join(";");
  }
}
