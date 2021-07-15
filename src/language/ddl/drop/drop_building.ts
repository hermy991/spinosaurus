import { clearNames } from "../../tools/sql.ts";
import { BaseBuilding } from "../../base_building.ts";

export class DropBuilding extends BaseBuilding {
  private _nameData:
    | { entity: string; schema?: string }
    | { schema: string }
    | null = null;
  private columnsData: Array<string> = [];

  constructor(
    public conf: { delimiters: [string, string?] } = { delimiters: [`"`] },
    public transformer: any = {},
  ) {
    super(conf);
  }

  drop(req: { entity: string; schema?: string } | { schema: string }): void {
    this._nameData = req;
  }

  columns(columns: Array<string> | string): void {
    columns = typeof columns == "string" ? [columns] : columns;
    this.columnsData = [];
    columns.forEach((x) => {
      this.addColumn(x);
    });
  }

  addColumn(column: string): void {
    column = `${column}`;
    this.columnsData.push(column);
  }

  getDropSchemaQuery(): string {
    if (!this._nameData) {
      return ``;
    }
    let { schema } = this._nameData;
    schema = clearNames({
      left: this.left,
      identifiers: schema,
      right: this.right,
    });
    return `DROP SCHEMA IF EXISTS ${schema}`;
  }

  getEntityQuery(type: "drop" | "alter"): string {
    if (!this._nameData) {
      return ``;
    }
    if (!("entity" in this._nameData)) {
      return ``;
    }
    const { entity, schema } = this._nameData;
    let query = clearNames({
      left: this.left,
      identifiers: entity,
      right: this.right,
    });
    if (schema) {
      query = clearNames({
        left: this.left,
        identifiers: [schema, entity],
        right: this.right,
      });
    }
    if (type == "drop") {
      return `DROP TABLE ${query}`;
    } else if (type == "alter") {
      return `ALTER TABLE ${query}`;
    }
    return ``;
  }

  getColumnsQuery(): string {
    if (!this.columnsData.length) {
      return ``;
    }
    let query = "";
    for (let i = 0; i < this.columnsData.length; i++) {
      const columnName = clearNames({
        left: this.left,
        identifiers: this.columnsData[i],
        right: this.right,
      });
      query += `DROP COLUMN ${columnName}`;
      if (i + 1 !== this.columnsData.length) {
        query += ", ";
      }
    }
    return `${query}`;
  }

  getQuery(): string {
    let query = ``;
    if (this._nameData === null) {
      return ``;
    }
    if ("schema" in this._nameData) {
      query = `${this.getDropSchemaQuery()}`;
      return query;
    }
    if (this.columnsData.length) {
      query = `${this.getEntityQuery("alter")}\n${this.getColumnsQuery()}`;
    } else {
      query = `${this.getEntityQuery("drop")}`;
    }
    return query;
  }
}
