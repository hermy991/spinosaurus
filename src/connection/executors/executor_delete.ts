import { ConnectionAll } from "../connection_type.ts";
import { BuilderDelete } from "../builders/builder_delete.ts";

export class ExecutorDelete {
  ub: BuilderDelete = new BuilderDelete(<ConnectionAll> {});
  constructor(public conn: ConnectionAll) {
    this.ub = new BuilderDelete(conn);
  }

  delete(
    req: { entity: string; schema?: string } | [string, string?] | Function,
  ): ExecutorDelete {
    this.ub.delete(req);
    return this;
  }

  where(
    conditions: [string, ...string[]],
    params?: { [x: string]: string | number | Date },
  ): ExecutorDelete {
    this.ub.where(conditions, params);
    return this;
  }

  addWhere(
    conditions: [string, ...string[]],
    params?: { [x: string]: string | number | Date },
  ): ExecutorDelete {
    this.ub.addWhere(conditions, params);
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
