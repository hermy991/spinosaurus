import { BuilderBase } from "./base/builder_base.ts";
import { ConnectionAll } from "../connection_type.ts";

export class BuilderInsert extends BuilderBase {
  #options: { autoInsert?: boolean } = { autoInsert: true };
  #entityData: { entity: string; schema?: string } | Function | null = null;
  #valuesData: Array<any> = [];

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

  values(data: Array<any> | any) {
    this.addValues(data);
  }

  addValues(data: Array<any> | any) {
    data = Array.isArray(data) ? data : [data];
    this.#valuesData.push(...data);
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
    return `INSERT INTO ${query}`;
  }

  getColumnsQuery() {
    if (!this.#valuesData.length) {
      return ``;
    }
    const columns: Set<string> = new Set();
    this.#valuesData.forEach((value) => {
      const keys = Object.keys(value);
      keys.forEach((key) => columns.add(this.clearNames(key)));
    });
    return `(${[...columns].join(", ")})`;
  }

  getValueQuery(obj: { [x: string]: string | number | Date }) {
    const columns: string[] = Object.values(obj).map((x) =>
      this.conn.stringify(x)
    );
    if (!columns.length) {
      return undefined;
    }
    return `(${columns.join(", ")})`;
  }

  getValuesQuery(data: Array<any> | any) {
    data = Array.isArray(data) ? data : [data];
    const objs: Array<string> = [];

    for (const obj of data) {
      const value = this.getValueQuery(obj);
      if (value) {
        objs.push(value);
      }
    }
    return `VALUES ${objs.join(", ")}`;
  }

  getQuery() {
    if (!this.#valuesData.length) {
      return ``;
    }
    const inserts: string[] = [];

    this.#valuesData.forEach((x) =>
      inserts.push(
        `${this.getEntityQuery()}\n${this.getColumnsQuery()}\n${
          this.getValuesQuery(x)
        }`,
      )
    );
    return inserts.join(";\n");
  }
}
