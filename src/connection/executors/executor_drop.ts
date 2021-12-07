import * as path from "deno/path/mod.ts";
import { Logging } from "../loggings/logging.ts";
import { Driver } from "../connection_type.ts";
import { BuilderDrop } from "../builders/builder_drop.ts";

export class ExecutorDrop {
  db: BuilderDrop = new BuilderDrop(<Driver> {});
  constructor(public conn: Driver, public logging?: Logging) {
    this.db = new BuilderDrop(conn, logging);
  }

  drop(
    req: { entity: string; schema?: string } | {
      schema: string;
      check?: boolean;
    },
  ): ExecutorDrop {
    this.db.drop(req);
    return this;
  }

  columns(columns: string | string[]): ExecutorDrop {
    this.db.columns(columns);
    return this;
  }

  addColumn(columns: string | string[]): ExecutorDrop {
    this.db.addColumn(columns);
    return this;
  }

  constraints(names: string | string[]): ExecutorDrop {
    this.db.constraints(names);
    return this;
  }

  addConstraint(names: string | string[]): ExecutorDrop {
    this.db.addConstraint(names);
    return this;
  }

  printSql(): ExecutorDrop {
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

  async execute(): Promise<any> {
    const query = this.db.getSqls();
    this.db.usePrintSql(query);
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
