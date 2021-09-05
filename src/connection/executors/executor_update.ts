import { ConnectionAll } from "../connection_type.ts";
// import { ConnectionPostgres } from "../drivers/postgres/connection_postgres.ts";
import { BuilderUpdate } from "../builders/builder_update.ts";
import {
  ParamUpdateEntity,
  ParamUpdateParams,
  ParamUpdateSet,
} from "../builders/params/param_update.ts";

export class ExecutorUpdate {
  ub: BuilderUpdate = new BuilderUpdate(<ConnectionAll> {});
  constructor(public conn: ConnectionAll) {
    this.ub = new BuilderUpdate(conn);
  }

  update(req: ParamUpdateEntity): ExecutorUpdate {
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
    conditions: [string, ...string[]] | string,
    params?: ParamUpdateParams,
  ): ExecutorUpdate {
    this.ub.where(conditions, params);
    return this;
  }

  andWhere(
    conditions: [string, ...string[]] | string,
    params?: ParamUpdateParams,
  ): ExecutorUpdate {
    this.ub.andWhere(conditions, params);
    return this;
  }

  orWhere(
    conditions: [string, ...string[]] | string,
    params?: ParamUpdateParams,
  ): ExecutorUpdate {
    this.ub.orWhere(conditions, params);
    return this;
  }

  addWhere(
    conditions: [string, ...string[]] | string,
    params?: ParamUpdateParams,
  ): ExecutorUpdate {
    this.ub.addWhere(conditions, params);
    return this;
  }

  printSql(): ExecutorUpdate {
    this.ub.printSql();
    return this;
  }

  getSqls(): string[] {
    const sqls = this.ub.getSqls();
    return sqls;
  }

  getSql(): string {
    const sqls = this.getSqls();
    return sqls.join(";\n");
  }

  async execute(): Promise<any> {
    const query = this.ub.getSqls();
    this.ub.usePrintSql(query);
    return await this.conn.execute(query.join(";\n"));
  }
}
