import {ConnectionPostgres} from './postgres/connection_postgres.ts';
import {ConnectionPostgresOptions} from './postgres/connection_postgres_options.ts'
import {ExecutorDrop} from './executors/executor_drop.ts'
import {ExecutorCreate} from './executors/executor_create.ts'
import {ExecutorSelect} from './executors/executor_select.ts'


class Connection {
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
  
  async checkObject(req: { name: string, namespace?: string }): Promise<{ name: string, namespace?: string, exists: boolean, oid?: number, dbdata?: any, type?: string }> {
    const defConn = this.connections[this.defIndex];
    const res = await defConn.checkObject(req);
    return res;
  };
  
  create(req: {entity: string, schema?: string}) {
    const defConn = this.connections[this.defIndex];
    let executor = new ExecutorCreate(defConn);
    executor.create(req);
    return executor;
  }

  drop(req: {entity: string, schema?: string}) {
    const defConn = this.connections[this.defIndex];
    let executor: ExecutorDrop = new ExecutorDrop(defConn);
    executor.drop(req);
    return executor;
  }

  select(... columns: Array<{column: string, as?: string} | [string, string?]>) {
    const defConn = this.connections[this.defIndex];
    let executor: ExecutorSelect = new ExecutorSelect(defConn);
    executor.select(... columns);
    return executor;
  }

  selectDistinct(... columns: Array<{column: string, as?: string} | [string, string?]>) {
    const defConn = this.connections[this.defIndex];
    let executor: ExecutorSelect = new ExecutorSelect(defConn);
    executor.selectDistinct(... columns);
    return executor;
  }

}

export {Connection}