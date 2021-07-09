import { ConnectionPostgres } from "../postgres/connection_postgres.ts";
import { InsertBuilding } from "../../language/dml/insert/insert_building.ts";

export class ExecutorInsert {
  ib: InsertBuilding = new InsertBuilding();
  constructor(public conn: ConnectionPostgres) {
    this.ib = new InsertBuilding(
      { delimiters: conn.delimiters },
      conn.transformer,
    );
  }

  insert(
    req: { entity: string; schema?: string } | [string, string?],
  ): ExecutorInsert {
    this.ib.insert(req);
    return this;
  }

  values(data: Array<any> | any): ExecutorInsert {
    this.ib.values(data);
    return this;
  }

  addValues(data: Array<any> | any): ExecutorInsert {
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
