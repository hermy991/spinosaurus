import { ConnectionAll } from "../connection_type.ts";
// import { ConnectionPostgres } from "../drivers/postgres/connection_postgres.ts";
import { BuilderUpdate } from "../builders/builder_update.ts";
import { ParamUpdateSet } from "../builders/params/param_update.ts";

export class ExecutorUpdate {
  ub: BuilderUpdate = new BuilderUpdate(<ConnectionAll> {});
  constructor(public conn: ConnectionAll) {
    this.ub = new BuilderUpdate(conn);
  }

  update(
    req:
      | { entity: string; schema?: string }
      | {
        entity: Function;
        options?: { autoUpdate?: boolean; updateWithoutPrimaryKey?: boolean };
      }
      | [string, string?]
      | Function,
  ): ExecutorUpdate {
    this.ub.update(req);
    return this;
  }

  set(columns: ParamUpdateSet[] | ParamUpdateSet): ExecutorUpdate {
    this.ub.set(columns);
    return this;
  }

  addSet(columns: ParamUpdateSet[] | ParamUpdateSet): ExecutorUpdate {
    this.ub.addSet(columns);
    return this;
  }

  where(
    conditions: [string, ...string[]],
    params?: { [x: string]: string | number | Date },
  ): ExecutorUpdate {
    this.ub.where(conditions, params);
    return this;
  }

  addWhere(
    conditions: [string, ...string[]],
    params?: { [x: string]: string | number | Date },
  ): ExecutorUpdate {
    this.ub.addWhere(conditions, params);
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
