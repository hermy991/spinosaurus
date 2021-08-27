import { ConnectionAll } from "../connection_type.ts";
import { BuilderDelete } from "../builders/builder_delete.ts";

export class ExecutorDelete {
  db: BuilderDelete = new BuilderDelete(<ConnectionAll> {});
  constructor(public conn: ConnectionAll) {
    this.db = new BuilderDelete(conn);
  }

  delete(
    req: { entity: string; schema?: string } | [string, string?] | Function,
  ): ExecutorDelete {
    this.db.delete(req);
    return this;
  }

  where(
    conditions: [string, ...string[]],
    params?: { [x: string]: string | number | Date },
  ): ExecutorDelete {
    this.db.where(conditions, params);
    return this;
  }

  addWhere(
    conditions: [string, ...string[]],
    params?: { [x: string]: string | number | Date },
  ): ExecutorDelete {
    this.db.addWhere(conditions, params);
    return this;
  }

  printSql(): ExecutorDelete {
    this.db.printSql();
    return this;
  }

  getSql(): string {
    const query = this.db.getSql();
    return query;
  }

  async execute(): Promise<any> {
    const query = this.db.getSql();
    this.db.usePrintSql(query);
    return await this.conn.execute(query);
  }
}
