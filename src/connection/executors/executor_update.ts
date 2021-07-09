import { ConnectionPostgres } from "../postgres/connection_postgres.ts";
import { UpdateBuilding } from "../../language/dml/update/update_building.ts";

export class ExecutorUpdate {
  ub: UpdateBuilding = new UpdateBuilding();
  constructor(public conn: ConnectionPostgres) {
    this.ub = new UpdateBuilding(
      { delimiters: conn.delimiters },
      conn.transformer,
    );
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
