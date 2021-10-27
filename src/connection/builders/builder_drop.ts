import { BuilderBase } from "./base/builder_base.ts";
import { Driver } from "../connection_type.ts";

export class BuilderDrop extends BuilderBase {
  #nameData:
    | { entity: string; schema?: string }
    | { schema: string; check?: boolean }
    | null = null;
  #columnsData: string[] = [];
  #constraintsData: string[] = [];

  constructor(public conn: Driver) {
    super(conn);
  }

  drop(
    req: { entity: string; schema?: string } | {
      schema: string;
      check?: boolean;
    },
  ): void {
    this.#nameData = req;
  }

  columns(columns: string | string[]): void {
    this.#columnsData = [];
    this.addColumn(columns);
  }

  addColumn(columns: string | string[]): void {
    columns = Array.isArray(columns) ? columns : [columns];
    this.#columnsData.push(...columns);
  }

  constraints(names: string | string[]): void {
    this.#constraintsData = [];
    this.addConstraint(names);
  }

  addConstraint(names: string | string[]): void {
    names = Array.isArray(names) ? names : [names];
    this.#constraintsData.push(...names);
  }

  getDropSchemaQuery(): string[] {
    if (!this.#nameData) {
      return [];
    }
    const nameData = self.structuredClone(this.#nameData);
    nameData.schema = this.clearNames(nameData.schema);
    return [this.conn.dropSchema(nameData)];
  }

  getEntityQuery(type: "drop" | "alter"): string {
    if (!this.#nameData) {
      return ``;
    }
    if (!("entity" in this.#nameData)) {
      return ``;
    }
    const { entity, schema } = this.#nameData;
    const query = this.clearNames([schema, entity]);
    if (type == "drop") {
      return `DROP TABLE ${query}`;
    } else if (type == "alter") {
      return `ALTER TABLE ${query}`;
    }
    return ``;
  }

  getColumnsQuery(names: string[]): string[] {
    if (!names.length) {
      return [];
    }
    const sqle = `${this.getEntityQuery("alter")}`;
    const sqls: string[] = [];
    sqls.push(
      `${sqle} DROP COLUMN ${names.map((x) => this.clearNames(x)).join(", DROP COLUMN ")}`,
    );
    return sqls;
  }

  getConstraintsQuery(names: string[]): string[] {
    const sqls: string[] = [];
    for (const name of names) {
      const sql = `${this.getEntityQuery("alter")} DROP CONSTRAINT ${this.clearNames(name)}`;
      sqls.push(sql);
    }
    return sqls;
  }

  getSqls(): string[] {
    if (this.#nameData === null) {
      return [];
    }
    if (!("entity" in this.#nameData)) {
      return this.getDropSchemaQuery();
    }
    const sqls: string[] = [];
    sqls.push(...this.getColumnsQuery(this.#columnsData));
    sqls.push(...this.getConstraintsQuery(this.#constraintsData));
    if (sqls.length) {
      return sqls;
    }
    return [this.getEntityQuery("drop")];
  }
}
