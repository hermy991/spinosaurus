import { Driver } from "../connection_type.ts";
// import { ConnectionPostgres } from "../drivers/postgres/connection_postgres.ts";
import { BuilderUpdate } from "../builders/builder_update.ts";
import { ParamUpdateEntity, ParamUpdateParams, ParamUpdateSet } from "../builders/params/param_update.ts";

export class ExecutorUpdate {
  ub: BuilderUpdate = new BuilderUpdate(<Driver> {});
  constructor(public driver: Driver, public transaction: any) {
    this.ub = new BuilderUpdate(driver);
  }

  update(req: ParamUpdateEntity): ExecutorUpdate {
    this.ub.update(req);
    return this;
  }

  set<T>(columns: ParamUpdateSet<T>[] | ParamUpdateSet<T>): ExecutorUpdate {
    this.ub.set(columns);
    return this;
  }

  addSet<T>(columns: ParamUpdateSet<T>[] | ParamUpdateSet<T>): ExecutorUpdate {
    this.ub.addSet(columns);
    return this;
  }

  where(conditions: [string, ...string[]] | string, params?: ParamUpdateParams): ExecutorUpdate {
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

  async execute(changes?: any): Promise<any> {
    const query = this.ub.getSqls();
    this.ub.usePrintSql(query);
    const options: Record<string, any> = { changes, transaction: this.transaction };
    return await this.driver.execute(query.join(";\n"), options);
  }
}
