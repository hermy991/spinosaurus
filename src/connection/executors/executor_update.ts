import { ConnectionAll } from "../connection_type.ts";
import { ConnectionPostgres } from "../postgres/connection_postgres.ts";
import { BuilderUpdate } from "../builders/builder_update.ts";

export class ExecutorUpdate {
  ub: BuilderUpdate = new BuilderUpdate(<ConnectionAll> {});
  constructor(public conn: ConnectionPostgres) {
    this.ub = new BuilderUpdate(conn);
  }

  update(
    req: { entity: string; schema?: string } | [string, string?],
  ): ExecutorUpdate {
    this.ub.update(req);
    return this;
  }

  set(
    ...columns: Array<
      { [x: string]: string | number | Date } | [
        string,
        string | number | Date | null,
      ]
    >
  ): ExecutorUpdate {
    this.ub.set(...columns);
    return this;
  }

  addSet(
    columns: { [x: string]: string | number | Date } | [
      string,
      string | number | Date | null,
    ],
  ): ExecutorUpdate {
    this.ub.addSet(columns);
    return this;
  }

  where(
    conditions: Array<string>,
    params?: { [x: string]: string | number | Date },
  ): ExecutorUpdate {
    this.ub.where(conditions, params);
    return this;
  }

  addWhere(
    conditions: Array<string>,
    params?: { [x: string]: string | number | Date },
  ): ExecutorUpdate {
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
