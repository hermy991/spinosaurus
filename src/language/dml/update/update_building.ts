import { clearNames, interpolate, stringify } from "../../tools/sql.ts";
import { BaseBuilding } from "../../base_building.ts";

/*****************************
 * TODO
 * columns(columns: Array<string>)
 * from(values: Array<any> | any, update = false)
 * use set and where in from implementation
 */
export class UpdateBuilding extends BaseBuilding {
  private entityData: { entity: string; schema?: string } | null = null;
  private setData: Array<[string, string | number | Date | null]> = [];
  private whereData: Array<string> = [];

  constructor(
    public conf: { delimiters: [string, string?] } = { delimiters: [`"`] },
    public transformer: {} = {},
  ) {
    super(conf);
  }

  update(req: { entity: string; schema?: string } | [string, string?]): void {
    if (Array.isArray(req)) {
      const [entity, schema] = req;
      this.entityData = { entity, schema };
    } else {
      this.entityData = req;
    }
  }

  set(
    ...columns: Array<
      { [x: string]: string | number | Date } | [
        string,
        string | number | Date | null,
      ]
    >
  ) {
    this.setData = [];
    columns.forEach((x) => this.addSet(x));
  }

  addSet(
    columns: { [x: string]: string | number | Date } | [
      string,
      string | number | Date | null,
    ],
  ) {
    if (Array.isArray(columns)) {
      this.setData.push(columns);
    } else {
      Object.entries(columns).forEach((x) => this.setData.push(x));
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
    const { entity, schema } = this.entityData;
    let query = `${
      clearNames({ left: this.left, identifiers: entity, right: this.right })
    }`;
    if (schema) {
      query = `${
        clearNames({
          left: this.left,
          identifiers: [schema, entity],
          right: this.right,
        })
      }`;
    }
    return `UPDATE ${query}`;
  }

  getSetQuery() {
    if (!this.setData.length) {
      return ``;
    }
    const columns: string[] = [];
    this.setData.forEach((col) => {
      const [column, value] = col;
      const tempStr = `${
        clearNames({ left: this.left, identifiers: column, right: this.right })
      } = ${stringify(value)}`;
      columns.push(tempStr);
    });
    return `SET ${columns.join(", ")}`;
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
    let query = `${this.getEntityQuery()}\n${this.getSetQuery()}`;
    if (this.whereData.length) {
      query += `\n${this.getWhereQuery()}`;
    }
    return query;
  }
}
