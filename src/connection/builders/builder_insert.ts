import { stringify } from "./base/sql.ts";
import { BuilderBase } from "./base/builder_base.ts";
import { ConnectionAll } from "../connection_type.ts";

export class BuilderInsert extends BuilderBase {
  private entityData: { entity: string; schema?: string } | null = null;
  private valuesData: Array<any> = [];

  constructor(public conn: ConnectionAll) {
    super(conn);
  }

  insert(req: { entity: string; schema?: string } | [string, string?]): void {
    if (Array.isArray(req)) {
      const [entity, schema] = req;
      this.entityData = { entity, schema };
    } else {
      this.entityData = req;
    }
  }

  values(data: Array<any> | any) {
    this.addValues(data);
  }

  addValues(data: Array<any> | any) {
    data = Array.isArray(data) ? data : [data];
    this.valuesData.push(...data);
  }

  getEntityQuery() {
    if (!this.entityData) {
      return ``;
    }
    const { entity, schema } = this.entityData;
    const query = `${this.clearNames([schema, entity])}`;
    return `INSERT INTO ${query}`;
  }

  getColumnsQuery() {
    if (!this.valuesData.length) {
      return ``;
    }
    const columns: Set<string> = new Set();
    this.valuesData.forEach((value) => {
      const keys = Object.keys(value);
      keys.forEach((key) => columns.add(this.clearNames(key)));
    });
    return `(${[...columns].join(", ")})`;
  }

  getValueQuery(obj: { [x: string]: string | number | Date }) {
    const columns: string[] = Object.values(obj).map((x) => stringify(x));
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
    if (!this.valuesData.length) {
      return ``;
    }
    const inserts: string[] = [];

    this.valuesData.forEach((x) =>
      inserts.push(
        `${this.getEntityQuery()}\n${this.getColumnsQuery()}\n${
          this.getValuesQuery(x)
        }`,
      )
    );
    return inserts.join(";\n");
  }
}
