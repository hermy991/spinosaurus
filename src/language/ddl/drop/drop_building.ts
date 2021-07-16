import { clearNames } from "../../tools/sql.ts";
import { BaseBuilding } from "../../base_building.ts";
import { _ } from "../../../../deps.ts";

export class DropBuilding extends BaseBuilding {
  private nameData:
    | { entity: string; schema?: string }
    | { schema: string; check?: boolean }
    | null = null;
  private columnsData: Array<string> = [];

  constructor(
    public conf: { delimiters: [string, string?] } = { delimiters: [`"`] },
    public transformer: { dropSchema?: Function } = {},
  ) {
    super(conf);
  }

  drop(
    req: { entity: string; schema?: string } | {
      schema: string;
      check?: boolean;
    },
  ): void {
    this.nameData = req;
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
    if (!this.nameData) {
      return ``;
    }
    if (this.transformer.dropSchema) {
      const nameData = _.cloneDeep(this.nameData);
      nameData.schema = clearNames({
        left: this.left,
        identifiers: nameData.schema,
        right: this.right,
      });
      return this.transformer.dropSchema(nameData);
    }
    return "";
  }

  getEntityQuery(type: "drop" | "alter"): string {
    if (!this.nameData) {
      return ``;
    }
    if (!("entity" in this.nameData)) {
      return ``;
    }
    const { entity, schema } = this.nameData;
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
    if (this.nameData === null) {
      return ``;
    }
    if (!("entity" in this.nameData)) {
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
