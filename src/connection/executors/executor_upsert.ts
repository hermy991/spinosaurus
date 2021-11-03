import { Driver } from "../connection_type.ts";
import { BuilderUpsert } from "../builders/builder_upsert.ts";
import { ParamUpsertEntity, ParamUpsertValue } from "../builders/params/param_upsert.ts";

export class ExecutorUpsert<T> {
  ub: BuilderUpsert<T> = new BuilderUpsert(<Driver> {});
  constructor(public driver: Driver, public transaction: any) {
    this.ub = new BuilderUpsert(driver);
  }

  upsert(req: ParamUpsertEntity): this {
    this.ub.upsert(req);
    return this;
  }

  values<T>(data: ParamUpsertValue<T>[] | ParamUpsertValue<T>): this {
    this.ub.values(data);
    return this;
  }

  addValues<T>(data: ParamUpsertValue<T>[] | ParamUpsertValue<T>): this {
    this.ub.addValues(data);
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
