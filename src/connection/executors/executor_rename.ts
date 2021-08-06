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

  getQuery(): string {
    const query = this.rb.getQuery();
    return query;
  }

  async execute(): Promise<any> {
    const query = this.rb.getQuery();
    return await this.conn.execute(query);
  }
}
