import { Driver } from "../connection_type.ts";
import { BuilderDelete } from "../builders/builder_delete.ts";

export class ExecutorDelete {
  db: BuilderDelete = new BuilderDelete(<Driver> {});
  constructor(public driver: Driver, public transaction: any) {
    this.db = new BuilderDelete(driver);
  }

  delete(req: { entity: string; schema?: string } | [string, string?] | Function): ExecutorDelete {
    this.db.delete(req);
    return this;
  }

  where(conditions: [string, ...string[]], params?: { [x: string]: string | number | Date }): ExecutorDelete {
    this.db.where(conditions, params);
    return this;
  }

  addWhere(conditions: [string, ...string[]], params?: { [x: string]: string | number | Date }): ExecutorDelete {
    this.db.addWhere(conditions, params);
    return this;
  }

  printSql(): ExecutorDelete {
    this.db.printSql();
    return this;
  }

  getSqls(): string[] {
    const sqls = this.db.getSqls();
    return sqls;
  }

  getSql(): string {
    const sqls = this.getSqls();
    return sqls.join(";\n");
  }

  async execute(changes?: any): Promise<any> {
    const query = this.db.getSqls();
    this.db.usePrintSql(query);
    const options: Record<string, any> = { changes, transaction: this.transaction };
    return await this.driver.execute(query.join(";\n"), options);
  }
}
