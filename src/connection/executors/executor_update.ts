import { Driver } from "../connection_type.ts";
// import { ConnectionPostgres } from "../drivers/postgres/connection_postgres.ts";
import { BuilderUpdate } from "../builders/builder_update.ts";
import { ParamUpdateEntity, ParamUpdateParams, ParamUpdateSet } from "../builders/params/param_update.ts";

export class ExecutorUpdate<T> {
  ub: BuilderUpdate<T> = new BuilderUpdate(<Driver> {});
  constructor(public driver: Driver, public transaction: any) {
    this.ub = new BuilderUpdate(driver);
  }

  update(req: ParamUpdateEntity): ExecutorUpdate<T> {
    this.ub.update(req);
    return this;
  }

  set<T>(columns: ParamUpdateSet<T>[] | ParamUpdateSet<T>): this {
    this.ub.set(columns);
    return this;
  }

  addSet<T>(columns: ParamUpdateSet<T>[] | ParamUpdateSet<T>): this {
    this.ub.addSet(columns);
    return this;
  }

  where(conditions: [string, ...string[]] | string, params?: ParamUpdateParams): this {
    this.ub.where(conditions, params);
    return this;
  }

  andWhere(conditions: [string, ...string[]] | string, params?: ParamUpdateParams): this {
    this.ub.andWhere(conditions, params);
    return this;
  }

  orWhere(conditions: [string, ...string[]] | string, params?: ParamUpdateParams): this {
    this.ub.orWhere(conditions, params);
    return this;
  }

  addWhere(conditions: [string, ...string[]] | string, params?: ParamUpdateParams): this {
    this.ub.addWhere(conditions, params);
    return this;
  }

  printSql(): this {
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
