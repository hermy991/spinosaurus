import { interpolate } from "./base/sql.ts";
import { BuilderBase } from "./base/builder_base.ts";
import { ConnectionAll } from "../connection_type.ts";

export class BuilderDelete extends BuilderBase {
  private entityData: { entity: string; schema?: string } | Function | null =
    null;
  private whereData: Array<string> = [];

  constructor(public conn: ConnectionAll) {
    super(conn);
  }

  delete(
    req: { entity: string; schema?: string } | [string, string?] | Function,
  ): void {
    if (Array.isArray(req)) {
      const [entity, schema] = req;
      this.entityData = { entity, schema };
    } else {
      this.entityData = req;
    }
  }

  where(
    conditions: Array<string>,
    params?: { [x: string]: string | number | Date },
  ) {
    this.whereData = [];
    this.addWhere(conditions, params);
  }

  addWhere(
    conditions: Array<string>,
    params?: { [x: string]: string | number | Date },
  ) {
    this.whereData.push(...interpolate(conditions, params));
  }

  getEntityQuery() {
    if (!this.entityData) {
      return ``;
    }
    let e: { schema?: string; entity?: string } = {};
    if (this.entityData instanceof Function) {
      e = this.getEntityData(
        this.conn.options.name,
        this.entityData,
        this.entityData,
      );
    } else {
      e = this.entityData;
    }
    const query = `${this.clearNames([e.schema, e.entity])}`;
    return `DELETE FROM ${query}`;
  }

  getWhereQuery() {
    if (!this.whereData.length) {
      return ``;
    }
    const conditions: string[] = [];
    for (let i = 0; i < this.whereData.length; i++) {
      const tempWhere = this.whereData[i];
      conditions.push(tempWhere);
    }
    return `WHERE ${conditions.join(" ")}`;
  }

  getQuery() {
    let query = `${this.getEntityQuery()}`;
    if (this.whereData.length) {
      query += `\n${this.getWhereQuery()}`;
    }
    return query;
  }
}
