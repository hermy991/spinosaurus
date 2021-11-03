import { BuilderBase } from "./base/builder_base.ts";
import { Driver } from "../connection_type.ts";

export class BuilderRename extends BuilderBase {
  #fromData: { entity: string; schema?: string } | undefined = undefined;
  #toData?: { entity: string };
  #columnsData: Array<[string, string]> = [];

  constructor(public driver: Driver) {
    super(driver);
  }

  rename(
    from: { entity: string; schema?: string },
    to?: { entity: string },
  ): void {
    this.#fromData = from;
    if (to) {
      this.#toData = to;
    }
  }

  columns(...columns: Array<[string, string]>): void {
    this.#columnsData = [];
    columns.forEach((x) => {
      this.addColumn(x);
    });
  }

  addColumn(column: [string, string]): void {
    this.#columnsData.push(column);
  }

  getEntityParts() {
    const o: { from?: string; to?: string } = {};
    if (!this.#fromData) {
      return {};
    }
    const { entity: fentity, schema: fschema } = this.#fromData;
    const tentity = this.#toData?.entity;

    o.from = this.clearNames(fentity);
    if (fschema) {
      o.from = this.clearNames([fschema, fentity]);
    }
    if (this.#toData) {
      o.to = this.clearNames(tentity);
    }
    return o;
  }

  getEntityQuery(): string[] {
    if (!this.#fromData && !this.#toData) {
      return [];
    }
    const { from, to } = this.getEntityParts();
    return [`ALTER TABLE ${from} RENAME TO ${to}`];
  }

  getColumnsQuery(): string[] {
    if (!this.#columnsData.length) {
      return [];
    }
    const sqls: string[] = [];
    const o = this.getEntityParts();
    let ename = o.from;
    if (o.to) {
      ename = this.clearNames([this.#fromData?.schema, o.to]);
    }
    for (let i = 0; i < this.#columnsData.length; i++) {
      let [from, to] = this.#columnsData[i];
      from = this.clearNames(from);
      to = this.clearNames(to);
      sqls.push(`ALTER TABLE ${ename} RENAME COLUMN ${from} TO ${to}`);
    }
    return sqls;
  }

  getSqls(): string[] {
    let sqls: string[] = [];
    if (this.#toData) {
      sqls.push(...this.getEntityQuery());
    }
    if (this.#columnsData.length) {
      sqls.push(...this.getColumnsQuery());
    }
    return sqls;
  }
}
