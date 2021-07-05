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

  uniques(... uniques: Array<{name?: string, columnNames: Array<string>}>): ExecutorCreate {
    this.cb.uniques(...uniques);
    return this;
  }

  addUnique(unique: {name?: string, columnNames: Array<string>}): ExecutorCreate{
    this.cb.addUnique(unique);
    return this;
  }


  data(data: Array<any> | any): ExecutorCreate {
    this.cb.data(data);
    return this;
  }

  addData(data: Array<any> | any): ExecutorCreate {
    this.cb.addColumn(data);
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