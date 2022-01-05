import { Logging } from "../loggings/logging.ts";
import { BuilderBase } from "./base/builder_base.ts";
import { BuilderUpdate } from "./builder_update.ts";
import { BuilderInsert } from "./builder_insert.ts";
import { ParamUpsertEntity, ParamUpsertValue } from "./params/param_upsert.ts";
import { Driver } from "../connection_type.ts";

export class BuilderUpsert<T> extends BuilderBase {
  #entityData:
    | { entity: string; schema?: string }
    | {
      entity: Function;
      options?: { autoUpdate?: boolean; autoInsert?: boolean };
    }
    | [string, string?]
    | Function
    | null = null;
  #valuesData: Array<ParamUpsertValue<T>> = [];

  constructor(public driver: Driver, public logging?: Logging) {
    super(driver, logging);
  }

  upsert(req: ParamUpsertEntity): void {
    this.#entityData = req;
  }

  values<T>(data: ParamUpsertValue<T>[] | ParamUpsertValue<T>) {
    this.#valuesData = [];
    this.addValues(<T> data);
  }

  addValues<T>(data: ParamUpsertValue<T>[] | ParamUpsertValue<T>) {
    data = Array.isArray(data) ? data : [data];
    data.forEach((d) => this.#valuesData.push(<T> d));
  }
  setPrimaryKeys(values: Record<string, any>[] = []) {
    if (!this.#entityData) {
      return;
    }
    let e: { schema?: string; entity?: string; classFunction?: Function } = {};
    let ps = [];
    if (this.#entityData instanceof Function) {
      e = this.getEntityData(this.driver.options.name, this.#entityData);
      e.classFunction = this.#entityData;
      ps = this.getColumns(this.driver.options.name, this.#entityData);
    }
    const primaryKeyColumns = ps.filter((x) => x.primary);
    for (let i = 0; i < values.length && values.length === this.#valuesData.length; i++) {
      for (let y = 0; y < primaryKeyColumns.length; y++) {
        const value2 = values[i];
        const primaryKeyColumn = primaryKeyColumns[y];
        if (primaryKeyColumn.name in value2) {
          const value1 = this.#valuesData[i];
          (<any> value1)[primaryKeyColumn.name] = value2[primaryKeyColumn.name];
        }
      }
    }
  }
  getSqls(): string[] {
    if (!this.#entityData) {
      return [];
    }
    const sqls: string[] = [];
    const bu = new BuilderUpdate(this.driver);
    bu.update(this.#entityData);
    bu.set(this.#valuesData);
    const u = bu.getSqls();
    const bi = new BuilderInsert(this.driver);
    bi.insert(this.#entityData);
    bi.values(this.#valuesData);
    const i = bi.getSqls();
    [...u, ...i].filter((x) => x).forEach((x) => sqls.push(x));
    return sqls;
  }
}
