import { ConnectionAll } from "../connection_type.ts";
import { BuilderInsert } from "../builders/builder_insert.ts";
import { ParamInsertValue } from "../builders/params/param_insert.ts";

export class ExecutorInsert {
  ib: BuilderInsert = new BuilderInsert(<ConnectionAll> {});
  constructor(public conn: ConnectionAll) {
    this.ib = new BuilderInsert(conn);
  }

  insert(
    req:
      | { entity: string; schema?: string }
      | { entity: Function; options?: { autoInsert?: boolean } }
      | [string, string?]
      | Function,
  ): ExecutorInsert {
    this.ib.insert(req);
    return this;
  }

  values(data: ParamInsertValue[] | ParamInsertValue): ExecutorInsert {
    this.ib.values(data);
    return this;
  }

  addValues(data: ParamInsertValue | ParamInsertValue): ExecutorInsert {
    this.ib.addValues(data);
    return this;
  }

  printSql(): ExecutorInsert {
    this.ib.printSql();
    return this;
  }

  getSql(): string {
    const query = this.ib.getSql();
    return query;
  }

  async execute(): Promise<any> {
    const query = this.ib.getSql();
    this.ib.usePrintSql(query);
    return await this.conn.execute(query);
  }
}
