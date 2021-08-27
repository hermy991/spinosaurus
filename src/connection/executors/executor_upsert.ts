import { ConnectionAll } from "../connection_type.ts";
import { BuilderUpsert } from "../builders/builder_upsert.ts";
import { ParamUpsertValue } from "../builders/params/param_upsert.ts";

export class ExecutorUpsert {
  ub: BuilderUpsert = new BuilderUpsert(<ConnectionAll> {});
  constructor(public conn: ConnectionAll) {
    this.ub = new BuilderUpsert(conn);
  }

  upsert(
    req:
      | { entity: string; schema?: string }
      | { entity: Function; options?: { autoInsert?: boolean } }
      | [string, string?]
      | Function,
  ): ExecutorUpsert {
    this.ub.upsert(req);
    return this;
  }

  values(data: ParamUpsertValue[] | ParamUpsertValue): ExecutorUpsert {
    this.ub.values(data);
    return this;
  }

  addValues(data: ParamUpsertValue[] | ParamUpsertValue): ExecutorUpsert {
    this.ub.addValues(data);
    return this;
  }

  getSql(): string {
    const query = this.ub.getSql();
    return query;
  }

  async execute(): Promise<any> {
    const query = this.ub.getSql();
    return await this.conn.execute(query);
  }
}
