import { ConnectionAll } from "../connection_type.ts";
import { BuilderDrop } from "../builders/builder_drop.ts";

export class ExecutorDrop {
  db: BuilderDrop = new BuilderDrop(<ConnectionAll> {});
  constructor(public conn: ConnectionAll) {
    this.db = new BuilderDrop(conn);
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

  columns(columns: Array<string> | string): ExecutorDrop {
    columns = typeof columns == "string" ? [columns] : columns;
    this.db.columns(columns);
    return this;
  }

  addColumn(columns: string | Array<string>): ExecutorDrop {
    if (Array.isArray(columns)) {
      for (let column of columns) {
        this.db.addColumn(column);
      }
    } else if (typeof columns == "string") {
      this.db.addColumn(columns);
    }
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
    return await this.conn.execute(query.join(";\n"));
  }
}
