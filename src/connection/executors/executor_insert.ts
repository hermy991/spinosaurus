import * as path from "deno/path/mod.ts";
import { Logging } from "../loggings/logging.ts";
import { Driver } from "../connection_type.ts";
import { BuilderInsert } from "../builders/builder_insert.ts";
import { ParamInsertEntity, ParamInsertReturning, ParamInsertValue } from "../builders/params/param_insert.ts";

export class ExecutorInsert<T> {
  ib: BuilderInsert<T> = new BuilderInsert(<Driver> {});
  constructor(public driver: Driver, public transaction: any, public logging?: Logging) {
    this.ib = new BuilderInsert(driver, logging);
  }

  insert(req: ParamInsertEntity): this {
    this.ib.insert(req);
    return this;
  }

  values<T>(data: ParamInsertValue<T>[] | ParamInsertValue<T>): this {
    this.ib.values(data);
    return this;
  }

  addValues<T>(data: ParamInsertValue<T> | ParamInsertValue<T>): this {
    this.ib.addValues(data);
    return this;
  }

  returning(...clauses: Array<ParamInsertReturning>): this {
    this.ib.returning(...clauses);
    return this;
  }

  addReturning(...clauses: Array<ParamInsertReturning>): this {
    this.ib.addReturning(...clauses);
    return this;
  }

  printSql(): this {
    this.ib.printSql();
    return this;
  }

  getSqls(): string[] {
    const sqls = this.ib.getSqls();
    return sqls;
  }

  getSql(): string {
    const sqls = this.getSqls();
    return sqls.join(";\n");
  }

  async execute(changes?: any): Promise<any> {
    const query = this.ib.getSqls();
    this.ib.usePrintSql(query);
    const options: Record<string, any> = { changes, transaction: this.transaction };
    if (this.logging) {
      await this.logging.write({
        logginKey: `query`,
        file: path.fromFileUrl(import.meta.url),
        className: this.constructor.name,
        functionName: `execute`,
        outLine: query.join(";").replace(/\n\r/ig, " "),
      });
    }
    const r = await this.driver.execute(query.join(";\n"), options);
    this.ib.setPrimaryKeys(r.rows || []);
    return r;
  }
}
