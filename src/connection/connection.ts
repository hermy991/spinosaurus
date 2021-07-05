import {path} from "../../deps.ts";
import {ConnectionPostgres} from './postgres/connection_postgres.ts';
import {ConnectionPostgresOptions} from './postgres/connection_postgres_options.ts'
import {ColumnType} from '../decorators/options/column_type.ts'
import {ExecutorDrop} from './executors/executor_drop.ts'
import {ExecutorCreate} from './executors/executor_create.ts'
import {ExecutorSelect} from './executors/executor_select.ts'
import {ExecutorRename} from './executors/executor_rename.ts'
import {ExecutorInsert} from './executors/executor_insert.ts'
import {ExecutorUpdate} from './executors/executor_update.ts'
import {ExecutorDelete} from './executors/executor_delete.ts'


class Connection {
  defIndex: number;
  connections: Array<ConnectionPostgres>;

  constructor(conn?: ConnectionPostgresOptions | Array<ConnectionPostgresOptions>, def: number | string = 0 ) {

    this.connections = [];

    if(Array.isArray(conn)){
      const conns = conn;
      for(let i = 0; i < conns.length; i++){
        if(conns[i].type === "postgres"){
          const temp = conns[i];
          this.connections.push(new ConnectionPostgres(temp.name, temp.type, temp.host, temp.port, temp.username, temp.password, temp.database, temp.synchronize, temp.entities, temp.hostaddr));
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
  
  async checkObject(req: { name: string, schema?: string, database?: string }): Promise<{ name: string, schema?: string, database?: string, exists: boolean, oid?: number, dbdata?: any, type?: string }> {
    const defConn = this.connections[this.defIndex];
    const res = await defConn.checkObject(req);
    return res;
  }

  async getCurrentDatabase(){
    const defConn = this.connections[this.defIndex];
    const res = await defConn.getCurrentDatabase();
    return res;
  }

  async getCurrentSchema(){
    const defConn = this.connections[this.defIndex];
    const res = await defConn.getCurrentSchema();
    return res;
  }

  getDbColumnType(req: { spitype: ColumnType, length?: number, precision?: number, scale?: number}){
    const defConn = this.connections[this.defIndex];
    const res = defConn.getDbColumnType(req);
    return res;
  }
  
  create(req: {entity: string, schema?: string}) {
    const defConn = this.connections[this.defIndex];
    const executor = new ExecutorCreate(defConn);
    executor.create(req);
    return executor;
  }

  drop(req: {entity: string, schema?: string}) {
    const defConn = this.connections[this.defIndex];
    const executor: ExecutorDrop = new ExecutorDrop(defConn);
    executor.drop(req);
    return executor;
  }

  rename(from: {entity: string, schema?: string}, to?: {entity: string, schema?: string}){
    const defConn = this.connections[this.defIndex];
    const executor: ExecutorRename = new ExecutorRename(defConn);
    executor.rename(from, to);
    return executor;
  }

  select(... columns: Array<{column: string, as?: string} | [string, string?]>) {
    const defConn = this.connections[this.defIndex];
    const executor: ExecutorSelect = new ExecutorSelect(defConn);
    executor.select(... columns);
    return executor;
  }

  selectDistinct(... columns: Array<{column: string, as?: string} | [string, string?]>) {
    const defConn = this.connections[this.defIndex];
    const executor: ExecutorSelect = new ExecutorSelect(defConn);
    executor.selectDistinct(... columns);
    return executor;
  }

  update(req: {entity: string, schema?: string } | [string, string?]) {
    const defConn = this.connections[this.defIndex];
    const executor: ExecutorUpdate = new ExecutorUpdate(defConn);
    executor.update(req);
    return executor;
  }

  insert(req: {entity: string, schema?: string } | [string, string?]) {
    const defConn = this.connections[this.defIndex];
    const executor: ExecutorInsert = new ExecutorInsert(defConn);
    executor.insert(req);
    return executor;
  }

  delete(req: {entity: string, schema?: string } | [string, string?]) {
    const defConn = this.connections[this.defIndex];
    const executor: ExecutorDelete = new ExecutorDelete(defConn);
    executor.delete(req);
    return executor;
  }

}

export {Connection}