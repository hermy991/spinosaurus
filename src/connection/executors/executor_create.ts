import {ConnectionPostgres} from "../postgres/connection_postgres.ts"
import {CreateBuilding} from "../../language/ddl/create/create_building.ts"

export class ExecutorCreate {
  cb: CreateBuilding = new CreateBuilding();
  constructor(public conn: ConnectionPostgres){  }

  create(req: {entity: string, schema?: string}): ExecutorCreate {
    this.cb.create(req);
    return this;
  }
  
  columns(... columns: Array<{ columnName: string, datatype: string, length?: number, nulleable?:boolean }>): ExecutorCreate {
    this.cb.columns(... columns);
    return this;
  }

  addColumn(columnName: string, datatype: string, length?: number, nulleable?:boolean): ExecutorCreate {
    this.cb.addColumn({columnName, datatype, length, nulleable});
    return this;
  }

  getQuery(): string {
    const query = this.cb.getQuery();
    return query;
  }

  async execute(): Promise<any> {
    const query = this.getQuery();
    return await this.conn.execute(query);
  }
}