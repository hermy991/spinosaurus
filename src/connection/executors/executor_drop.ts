import {ConnectionPostgres} from "../postgres/connection_postgres.ts"

export class ExecutorDrop {
  constructor(public conn: ConnectionPostgres){  }

  drop(req: {entity: string, schema?: string}){
    this.conn.
  }

  columns(columns: string[]){
      
  }
}