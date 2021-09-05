import { ConnectionAll } from "../connection_type.ts";
import { BuilderInsert } from "../builders/builder_insert.ts";
import {
  ParamInsertEntity,
  ParamInsertValue,
} from "../builders/params/param_insert.ts";

export class ExecutorInsert {
  ib: BuilderInsert = new BuilderInsert(<ConnectionAll> {});
  constructor(public conn: ConnectionAll) {
    this.ib = new BuilderInsert(conn);
  }

  insert(req: ParamInsertEntity): ExecutorInsert {
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

  getSqls(): string[] {
    const sqls = this.ib.getSqls();
    return sqls;
  }

  getSql(): string {
    const sqls = this.getSqls();
    return sqls.join(";\n");
  }

  async execute(): Promise<any> {
    const query = this.ib.getSqls();
    this.ib.usePrintSql(query);
    return await this.conn.execute(query.join(";\n"));
  }
}
