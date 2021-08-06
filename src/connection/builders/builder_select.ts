import { interpolate } from "./base/sql.ts";
import { BuilderBase } from "./base/builder_base.ts";
import { ConnectionAll } from "../connection_type.ts";
import { linkMetadataToFromData } from "../../decorators/metadata/metadata.ts";

export class BuilderSelect extends BuilderBase {
  private selectData: Array<{ column: string; as?: string }> = [];
  private fromData: { entity: string; schema?: string; as?: string } | null =
    null;
  private whereData: Array<string> = [];
  private orderByData: Array<{ column: string; direction?: string }> = [];

  /*FLAGS*/
  private distinct = false;

  constructor(public conn: ConnectionAll) {
    super(conn);
  }

  selectDistinct(...columns: Array<{ column: string; as?: string }>): void {
    this.distinct = true;
    this.select(...columns);
  }

  select(...columns: Array<{ column: string; as?: string }>): void {
    this.selectData = [];
    columns.forEach((x) => this.addSelect(x));
  }

  addSelect(req: { column: string; as?: string }): void {
    this.selectData.push(req);
  }

  from(
    req: { entity: string; schema?: string; as?: string } | {
      entity: Function;
      as?: string;
    },
  ): void {
    if (req.entity instanceof Function) {
      const fromData = {
        ...linkMetadataToFromData({
          currentSquema: "",
          connName: this.conn.options.name,
        }, req.entity),
        as: req.as,
      };
      this.fromData = fromData;
    } else {
      this.fromData = <any> req;
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

  orderBy(...columns: Array<{ column: string; direction?: string }>): void {
    this.orderByData = [];
    columns.forEach((x) => this.addOrderBy(x));
  }

  addOrderBy(...columns: Array<{ column: string; direction?: string }>): void {
    columns.forEach((x) => this.orderByData.push(x));
  }

  getSelectQuery() {
    if (!this.selectData.length) {
      return `SELECT ${this.distinct ? "DISTINCT " : ""}* `;
    }
    const columns: string[] = [];
    for (let i = 0; i < this.selectData.length; i++) {
      const { column, as } = this.selectData[i];
      const tempCol = `${column}` +
        (as ? ` AS ${this.clearNames(as)}` : "");
      columns.push(tempCol);
    }
    return `SELECT ${this.distinct ? "DISTINCT " : ""}${columns.join(", ")}`;
  }

  getFromQuery() {
    if (!this.fromData) {
      return ``;
    }
    const { entity, schema, as } = this.fromData;
    let query = `${this.clearNames([schema, entity])}`;
    if (as) {
      query = `${query} AS ${this.clearNames([as])}`;
    }
    return `FROM ${query}`;
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

  getOrderByQuery() {
    if (!this.orderByData.length) {
      return ``;
    }
    const orders: string[] = [];
    for (let i = 0; i < this.orderByData.length; i++) {
      const { column, direction } = this.orderByData[i];
      const tempOrder = `${column}` +
        (direction ? " " + direction.toUpperCase() : "");
      orders.push(tempOrder);
    }
    return `ORDER BY ${orders.join(", ")}`;
  }

  getQuery() {
    let query = `${this.getSelectQuery()}\n${this.getFromQuery()}`;
    if (this.whereData.length) {
      query += `\n${this.getWhereQuery()}`;
    }
    if (this.orderByData.length) {
      query += `\n${this.getOrderByQuery()}`;
    }
    return query;
  }
}
