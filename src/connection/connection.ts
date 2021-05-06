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

  async test(): Promise<boolean> {
    const defConn = this.connections[this.defIndex];
    const res = await defConn.test();
    return res;
  }

  selectDistinct(... conditions: Array<[string, string?]>) {
    const defConn = this.connections[this.defIndex];
    defConn.selectDistinct(... conditions);
    return this;
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

  where(... conditions: Array<string>) {
    const defConn = this.connections[this.defIndex];
    defConn.where(... conditions);
    return this;
  }
  
  addWhere(condition: string) {
    const defConn = this.connections[this.defIndex];
    defConn.where(condition);
    return this;
  }

  orderBy(... columns: Array<[string, string?]>) {
    const defConn = this.connections[this.defIndex];
    defConn.orderBy(... columns);
    return this;
  }

  addOrderBy(column: string, direction?: string) {
    const defConn = this.connections[this.defIndex];
    defConn.addOrderBy(column, direction);
    return this;
  }

  getQuery(): string {
    const defConn = this.connections[this.defIndex];
    return defConn.getQuery();
  }

  async getRaw(): Promise<Array<any>>{
    const defConn = this.connections[this.defIndex];
    return defConn.getRaw();
  }

  async getRawArray(): Promise<Array<any>>{
    const defConn = this.connections[this.defIndex];
    return defConn.getRawArray();
  }

  async getOne(): Promise<any> {
    const defConn = this.connections[this.defIndex];
    return defConn.getOne();
  }
  async getMany(): Promise<Array<any>> {
    return [];
  }

}

export {Connection}