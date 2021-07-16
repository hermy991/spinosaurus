import { ConnectionPostgres } from "../postgres/connection_postgres.ts";
import { DropBuilding } from "../../language/ddl/drop/drop_building.ts";

export class ExecutorDrop {
  db: DropBuilding = new DropBuilding();
  constructor(public conn: ConnectionPostgres) {
    this.db = new DropBuilding(
      { delimiters: conn.delimiters },
      conn.transformer,
    );
  }

  drop(
    req: { entity: string; schema?: string } | {
      schema: string;
      check?: boolean;
    },
  ): ExecutorDrop {
    this.db.drop(req);
    return this;
  }

  columns(columns: Array<string> | string): ExecutorDrop {
    columns = typeof columns == "string" ? [columns] : columns;
    this.db.columns(columns);
    return this;
  }

  addColumn(columns: string | Array<string>): ExecutorDrop {
    if (Array.isArray(columns)) {
      for (let column of columns) {
        this.db.addColumn(column);
      }
    } else if (typeof columns == "string") {
      this.db.addColumn(columns);
    }
    return this;
  }

  getQuery(): string {
    const query = this.db.getQuery();
    return query;
  }

  async execute(): Promise<any> {
    const query = this.db.getQuery();
    return await this.conn.execute(query);
  }
}
