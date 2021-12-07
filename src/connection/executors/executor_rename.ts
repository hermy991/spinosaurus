import * as path from "deno/path/mod.ts";
import { Logging } from "../loggings/logging.ts";
import { Driver } from "../connection_type.ts";
import { BuilderRename } from "../builders/builder_rename.ts";

export class ExecutorRename {
  rb: BuilderRename = new BuilderRename(<Driver> {});
  constructor(public conn: Driver, public logging?: Logging) {
    this.rb = new BuilderRename(conn, logging);
  }

  rename(
    from: { entity: string; schema?: string },
    to?: { entity: string; schema?: string },
  ): ExecutorRename {
    this.rb.rename(from, to);
    return this;
  }

  columns(...columns: Array<[string, string]>): ExecutorRename {
    this.rb.columns(...columns);
    return this;
  }

  addColumn(column: [string, string]): ExecutorRename {
    this.rb.addColumn(column);
    return this;
  }

  printSql(): ExecutorRename {
    this.rb.printSql();
    return this;
  }

  getSqls(): string[] {
    const sqls = this.rb.getSqls();
    return sqls;
  }

  getSql(): string {
    const sqls = this.getSqls();
    return sqls.join(";\n");
  }

  async execute(): Promise<any> {
    const query = this.rb.getSqls();
    this.rb.usePrintSql(query);
    if (this.logging) {
      await this.logging.write({
        logginKey: `schema`,
        file: path.fromFileUrl(import.meta.url),
        className: this.constructor.name,
        functionName: `execute`,
        outLine: query.join(";").replace(/\n\r/ig, " "),
      });
    }
    return await this.conn.execute(query.join(";\n"));
  }
}
