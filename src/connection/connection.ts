import {IConnectionOptions} from './iconnection_options.ts'

import {ConnectionPostgres} from './postgres/connection_postgres.ts';
import {ConnectionPostgresOptions} from './postgres/connection_postgres_options.ts'
import {IConnectionPostgresOperations} from './postgres/iconnection_postgres_operations.ts'
class Connection implements IConnectionPostgresOperations {
  private defIndex: number;
  connections: Array<ConnectionPostgres>;

  constructor(conn?: ConnectionPostgresOptions | Array<ConnectionPostgresOptions>, def: number | string = 0 ) {

    this.connections = [];

    if(Array.isArray(conn)){
      const conns = conn;
      for(let i = 0; i < conns.length; i++){
        if(conns[i].type === "postgres"){
          const conn = conns[i];
          this.connections.push(new ConnectionPostgres(conn.name, conn.type, conn.host, conn.port, conn.username, conn.password, conn.database, conn.synchronize, conn.entities, conn.hostaddr));
        }
      }
    }
    else if (conn) {
      if(conn.type === "postgres"){
        this.connections.push(new ConnectionPostgres(conn.name, conn.type, conn.host, conn.port, conn.username, conn.password, conn.database, conn.synchronize, conn.entities, conn.hostaddr));
      }
    }

    this.defIndex = 0;
    if(typeof def == "number" ){
      this.defIndex = def;
    }
    else if (typeof def === "string"){
      this.defIndex = 0;
      for(let i = 0; i < this.connections.length; i++){
        if(this.connections[i].name === def){
          this.defIndex = i;
          break;
        }
      }
    }
  }

  select(... conditions: Array<[string, string?]>) {
    const defConn = this.connections[this.defIndex];
    defConn.select(... conditions);
    return this;
  }

  addSelect(column: string, as?: string) {
    const defConn = this.connections[this.defIndex];
    defConn.addSelect(column, as);
    return this;
  }

  from(entity: string, as?: string) {
    const defConn = this.connections[this.defIndex];
    defConn.from(entity, as);
    return this;
  }

  where(...conditions: string[][]) {
    throw new Error("Method not implemented.");
  }
  
  addWhere(...conditions: string[]) {
  throw new Error("Method not implemented.");
  }

  orderBy(...columns: Array<[string, string?]>) {
    throw new Error("Method not implemented.");
  }

  addOrderBy(columns: string,direction?: string) {
    throw new Error("Method not implemented.");
  }

  getQuery(): string {
    const defConn = this.connections[this.defIndex];
    return defConn.getQuery();
  }

  getRaw() {
    const defConn = this.connections[this.defIndex];
    return defConn.getRaw();
  }

  getOne(): any {
    const defConn = this.connections[this.defIndex];
    return defConn.getOne();
  }
  getMany(): Array<any> {
    return [];
  }

}

export {Connection}