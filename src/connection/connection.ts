import {IConnectionOptions} from './iconnection_options.ts'

import {ConnectionPostgres} from './postgres/connection_postgres.ts';
import {IConnectionPostgresOptions} from './postgres/iconnection_postgres_options.ts'
import {IConnectionPostgresOperations} from './postgres/iconnection_postgres_operations.ts'
class Connection implements IConnectionPostgresOperations {
  private defIndex: number;
  public connections: Array<ConnectionPostgres>;

  public constructor(conn?: IConnectionPostgresOptions | Array<IConnectionPostgresOptions>, def: number | string = 0 ) {

    this.connections = [];

    if(Array.isArray(conn)){
      const conns = conn as Array<IConnectionOptions>;
      for(let i = 0; i < conns.length; i++){
        if(conns[i].type === "postgres"){
          const oconn = conns[i] as IConnectionPostgresOptions;
          this.connections.push(oconn as ConnectionPostgres);
        }
      }
    }
    else if (conn) {
      const oconn = conn as IConnectionOptions;
      if(oconn.type === "postgres"){
        this.connections.push(oconn as ConnectionPostgres);
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

  public select(... conditions: Array<Array<string>>) {
    const defConn = this.connections[this.defIndex];
    defConn.select(... conditions);
    return this;
  }

  public addSelect(column: string, as?: string) {
    const defConn = this.connections[this.defIndex];
    defConn.addSelect(column);
    return this;
  }

  public from(entity: string, as?: string) {
    const defConn = this.connections[this.defIndex];
    defConn.from(entity, as);
    return this;
  }

  public where(...conditions: string[][]) {
    throw new Error("Method not implemented.");
  }
  
  addWhere(...conditions: string[]) {
  throw new Error("Method not implemented.");
  }

  orderBy(...columns: string[][]) {
    throw new Error("Method not implemented.");
  }

  addOrderBy(columns: string,direction?: string) {
    throw new Error("Method not implemented.");
  }

  public getQuery() {
    const defConn = this.connections[this.defIndex];
    return defConn.getQuery();
  }

  public getRaw() {
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