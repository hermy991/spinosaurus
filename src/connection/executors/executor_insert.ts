import { ConnectionAll } from "../connection_type.ts";
import { BuilderInsert } from "../builders/builder_insert.ts";

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

  values(
    data:
      | Array<
        { [x: string]: string | number | boolean | Date | Function | null }
      >
      | { [x: string]: string | number | boolean | Date | Function | null },
  ): ExecutorInsert {
    this.ib.values(data);
    return this;
  }

  addValues(
    data:
      | Array<
        { [x: string]: string | number | boolean | Date | Function | null }
      >
      | { [x: string]: string | number | boolean | Date | Function | null },
  ): ExecutorInsert {
    this.ib.addValues(data);
    return this;
  }

  getQuery(): string {
    const query = this.ib.getQuery();
    return query;
  }

  async execute(): Promise<any> {
    const query = this.ib.getQuery();
    return await this.conn.execute(query);
  }
}
