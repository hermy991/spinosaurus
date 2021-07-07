import {ConnectionPostgres} from "../postgres/connection_postgres.ts"
import {DeleteBuilding} from "../../language/dml/delete/delete_building.ts"

export class ExecutorDelete {
  ub: DeleteBuilding = new DeleteBuilding();
  constructor(public conn: ConnectionPostgres){
    this.ub = new DeleteBuilding({ delimiters: conn.delimiters }, conn.transformer);
  }

  delete(req: {entity: string, schema?: string } | [string, string?]): ExecutorDelete {
    this.ub.delete(req);
    return this;
  }

  where(conditions: Array<string>, params?: { [x:string]: string | number | Date }): ExecutorDelete {
    this.ub.where(conditions, params);
    return this;
  }

  addWhere(conditions: Array<string>, params?: { [x:string]: string | number | Date }): ExecutorDelete {
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