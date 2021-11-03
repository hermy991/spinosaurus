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

  constructor(public driver: Driver) {
    super(driver);
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
