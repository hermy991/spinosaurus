import { ConnectionAll } from "../connection_type.ts";
import { BuilderRename } from "../builders/builder_rename.ts";

export class ExecutorRename {
  rb: BuilderRename = new BuilderRename(<ConnectionAll> {});
  constructor(public conn: ConnectionAll) {
    this.rb = new BuilderRename(conn);
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
    return await this.conn.execute(query.join(";\n"));
  }
}
