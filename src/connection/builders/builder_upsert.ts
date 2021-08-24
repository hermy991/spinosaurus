import { BuilderBase } from "./base/builder_base.ts";
import { BuilderUpdate } from "./builder_update.ts";
import { BuilderInsert } from "./builder_insert.ts";
import { ParamUpsertValue } from "./params/param_upsert.ts";
import { ConnectionAll } from "../connection_type.ts";

export class BuilderUpsert extends BuilderBase {
  #entityData:
    | { entity: string; schema?: string }
    | {
      entity: Function;
      options?: { autoUpdate?: boolean; autoInsert?: boolean };
    }
    | [string, string?]
    | Function
    | null = null;
  #valuesData: Array<ParamUpsertValue> = [];

  constructor(public conn: ConnectionAll) {
    super(conn);
  }

  upsert(
    req:
      | { entity: string; schema?: string }
      | {
        entity: Function;
        options?: { autoUpdate?: boolean; autoInsert?: boolean };
      }
      | [string, string?]
      | Function,
  ): void {
    this.#entityData = req;
  }

  values(data: ParamUpsertValue[] | ParamUpsertValue) {
    this.#valuesData = [];
    this.addValues(data);
  }

  addValues(data: ParamUpsertValue[] | ParamUpsertValue) {
    data = Array.isArray(data) ? data : [data];
    this.#valuesData.push(...data);
  }

  getQuery() {
    if (!this.#entityData) {
      return "";
    }
    const sqls: string[] = [];
    const bu = new BuilderUpdate(this.conn);
    bu.update(this.#entityData);
    bu.set(this.#valuesData);
    const u = bu.getQuery();
    const bi = new BuilderInsert(this.conn);
    bi.insert(this.#entityData);
    bi.values(this.#valuesData);
    const i = bi.getQuery();
    [u, i].filter((x) => x).forEach((x) => sqls.push(x));
    return sqls.join(";\n");
  }
}
