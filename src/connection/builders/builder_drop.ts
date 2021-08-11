import { BuilderBase } from "./base/builder_base.ts";
import { ConnectionAll } from "../connection_type.ts";

export class BuilderDrop extends BuilderBase {
  private nameData:
    | { entity: string; schema?: string }
    | { schema: string; check?: boolean }
    | null = null;
  private columnsData: Array<string> = [];

  constructor(public conn: ConnectionAll) {
    super(conn);
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
    const nameData = self.structuredClone(this.nameData);
    nameData.schema = this.clearNames(nameData.schema);
    return this.conn.dropSchema(nameData);
  }

  getEntityQuery(type: "drop" | "alter"): string {
    if (!this.nameData) {
      return ``;
    }
    if (!("entity" in this.nameData)) {
      return ``;
    }
    const { entity, schema } = this.nameData;
    let query = this.clearNames(entity);
    if (schema) {
      query = this.clearNames([schema, entity]);
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
      const columnName = this.clearNames(this.columnsData[i]);
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
