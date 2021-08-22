import { ConnectionAll } from "../connection_type.ts";
import { BuilderUpsert } from "../builders/builder_upsert.ts";

export class ExecutorUpsert {
  ub: BuilderUpsert = new BuilderUpsert(<ConnectionAll> {});
  constructor(public conn: ConnectionAll) {
    this.ub = new BuilderUpsert(conn);
  }

  upsert(
    req:
      | { entity: string; schema?: string }
      | { entity: Function; options?: { autoInsert?: boolean } }
      | [string, string?]
      | Function,
  ): ExecutorUpsert {
    this.ub.upsert(req);
    return this;
  }

  values(
    data:
      | Array<
        { [x: string]: string | number | boolean | Date | Function | null }
      >
      | { [x: string]: string | number | boolean | Date | Function | null },
  ): ExecutorUpsert {
    this.ub.values(data);
    return this;
  }

  addValues(
    data:
      | Array<
        { [x: string]: string | number | boolean | Date | Function | null }
      >
      | { [x: string]: string | number | boolean | Date | Function | null },
  ): ExecutorUpsert {
    this.ub.addValues(data);
    return this;
  }

  getQuery(): string {
    const query = this.ub.getQuery();
    return query;
  }

  async execute(): Promise<any> {
    const query = this.ub.getQuery();
    return await this.conn.execute(query);
  }
}
