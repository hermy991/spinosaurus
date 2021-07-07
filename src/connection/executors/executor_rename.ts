import {ConnectionPostgres} from "../postgres/connection_postgres.ts"
import {RenameBuilding} from "../../language/ddl/rename/rename_building.ts"

export class ExecutorRename {
  rb: RenameBuilding = new RenameBuilding();
  constructor(public conn: ConnectionPostgres){ 
    this.rb = new RenameBuilding({ delimiters: conn.delimiters }, conn.transformer);
   }

  rename(from: {entity: string, schema?: string}, to?: {entity: string, schema?: string}): ExecutorRename {
    this.rb.rename(from, to);
    return this;
  }

  columns(... columns: Array<[string, string]>): ExecutorRename {
    this.rb.columns(... columns)
    return this;
  }

  addColumn(column: [string, string]): ExecutorRename {
    this.rb.addColumn(column);
    return this;
  }

  getQuery(): string {
    const query = this.rb.getQuery();
    return query;
  }

  async execute(): Promise<any> {
    const query = this.rb.getQuery();
    return await this.conn.execute(query);
  }
}