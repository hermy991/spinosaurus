//import {ConnectionPostgresOptions} from './connection_postgres_options.ts'
import {IConnectionPostgresOptions} from './iconnection_postgres_options.ts'
import {IConnectionPostgresOperations} from './iconnection_postgres_operations.ts'
import {SelectBuilding} from '../../language/dml/select/select_building.ts';
import {CreateBuilding} from '../../language/ddl/create/create_building.ts';
import {DropBuilding} from '../../language/ddl/drop/drop_building.ts';
import {initConnection} from './connection_postgres_pool.ts';
import {filterConnectionProps} from '../connection_operations.ts'
//import {Pool} from 'postgres/mod.ts';
import {postgres} from '../../../deps.ts';
import {KEY_CONFIG} from './connection_postgres_variables.ts'

class ConnectionPostgres implements IConnectionPostgresOptions, IConnectionPostgresOperations {
  currBuilding: "sb" | "cb" | "db" | undefined = undefined;
  
  sb: SelectBuilding = new SelectBuilding();
  cb: CreateBuilding = new CreateBuilding();
  db: DropBuilding = new DropBuilding();

  constructor(public name: string,
    public type: string = "postgres",
    public host: string = "localhost",
    public port: number = 5432,
    public username: string,
    public password: string,
    public database: string,
    public synchronize: boolean = false,
    public entities: string,
    public hostaddr?: string
  ) {    }
  /* Basic Connection Operations*/
  
  async test(): Promise<boolean> {
    let driverConf = filterConnectionProps(KEY_CONFIG, this);
    // console.log({driverConf})
    // driverConf["tls"] = { enforce: false };
    try{
      const pool = (initConnection(driverConf) as postgres.Pool);
      const client = await pool.connect();
      const query = this.getQuery()
      client.release();
      await pool.end();
      return true;
    }
    catch(err){
      return false;
    }
  }
  
  async checkObject(req: { name: string, namespace?: string }): Promise<{ name: string, namespace?: string, exists: boolean, oid?: number, dbdata?: any, type?: string }> {
    let driverConf = filterConnectionProps(KEY_CONFIG, this);
    const pool = (initConnection(driverConf) as postgres.Pool);
    const client = await pool.connect();
    req.name = req.name.replace(/'/ig, "''");
    req.namespace = (req.namespace || "").replace(/'/ig, "''");
    const query = `
SELECT * 
FROM pg_catalog.pg_class c
JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname not in ('pg_catalog', 'information_schema')
  AND n.nspname = '${req.namespace}'
  AND c.relname = '${req.name}'
    `;
    const result = await client.queryObject(query);
    client.release();
    await pool.end();
    let rows = result.rows;
    let type = "";
    if(rows.length){
      switch(rows[0].relkind) {
        /*
        r = ordinary table, 
        i = index, 
        S = sequence, 
        t = TOAST table, 
        v = view, 
        m = materialized view, 
        c = composite type, 
        f = foreign table, 
        p = partitioned table, 
        I = partitioned index
        */ 
        case "r": type = "table"; break;
        case "i": type = "index"; break;
        case "S": type = "sequence"; break;
        case "t": type = "toast table"; break;
        case "v": type = "view"; break;
        case "m": type = "materialized view"; break;
        case "c": type = "type"; break;
        case "f": type = "foreign table"; break;
        case "p": type = "partitioned table"; break;
        case "I": type = "partitioned index"; break;
      }
    }
    let res = { ...req,  
      exists: rows.length > 0,
      oid: rows.length ? Number(rows[0].oid) : undefined,
      dbdata: rows.length ? rows[0] : undefined,
      type: rows.length ? type : undefined
    };
    return res;
  }
  /** DDL SQL Operations*/
  create(entity: string, schema?: string): void {
    this.currBuilding = "cb";
    this.cb.create(entity, schema);
  }
  columns(... columns: Array<{ columnName: string, datatype: string, length?: number, nulleable?:boolean } | string>): void {
    if(this.currBuilding == "cb"){
      this.cb.columns(... (columns as Array<{ columnName: string, datatype: string, length?: number, nulleable?:boolean }>));
    }
    else if (this.currBuilding == "db"){
      this.db.columns(... (columns as Array<string>));
    }
  }
  addColumn(columnName: string, datatype: string, length?: number, nulleable?:boolean): void {
    this.cb.addColumn({columnName, datatype, length, nulleable});
  }

  drop(entity: string, schema?: string): void {
    this.currBuilding = "db";
    this.db.drop(entity, schema);
  }
  
  /** DML SQL Operation*/
  selectDistinct(... columns: Array<[string, string?]>): void {
    this.currBuilding = "sb";
    this.sb.selectDistinct(... columns);
  };
  select(... columns: Array<[string, string?]>): void {
    this.currBuilding = "sb";
    this.sb.select(... columns);
  };
  addSelect(column: string, as?: string): void {
    this.sb.addSelect(column, as);
  };
  
  from(entity: string, as?: string, schema?: string): void {
    this.sb.from(entity, as, schema);
  }
  where(... conditions: Array<string>): void {
    this.sb.where(... conditions);
  }
  addWhere(condition: string): any {
    this.sb.addWhere(condition)

  }
  orderBy(... columns: Array<[string, string?]>): any {
    this.sb.orderBy(... columns);
  }
  addOrderBy(column: string, direction?: string): any {
    this.sb.addOrderBy(column, direction);
  }
  /* Returns*/
  getQuery(): string {
    if(this.currBuilding){
      return this[this.currBuilding].getQuery();
    }
    return "";
  }
  async execute(): Promise<any> {
    let driverConf = filterConnectionProps(KEY_CONFIG, this);
    const pool = (initConnection(driverConf) as postgres.Pool);
    const client = await pool.connect();
    const query = this.getQuery();
    const result = await client.queryArray(query);
    client.release();
    await pool.end();
    return result;
  }
  async getRawOne(): Promise<any> {
    const rows = await this.getRawMany();
    return rows.length ? rows[0] : null;
  }
  async getRawMany(): Promise<Array<any>> {
    let driverConf = filterConnectionProps(KEY_CONFIG, this);
    const pool = (initConnection(driverConf) as postgres.Pool);
    const client = await pool.connect();
    const query = this.getQuery();
    const result = await client.queryObject(query);
    client.release();
    await pool.end();
    return result.rows;
  }
  async getRawMultiple(): Promise<Array<any>> {
    let driverConf = filterConnectionProps(KEY_CONFIG, this);
    const pool = (initConnection(driverConf) as postgres.Pool);
    const client = await pool.connect();
    const query = this.getQuery();
    const result = await client.queryObject(query);
    client.release();
    await pool.end();
    return result.rows;
  }
  /* Returns entities*/
  async getOne(): Promise<any> {
    return {};
  }
  async getMany(): Promise<Array<any>> {
    return [];
  }
}

export {ConnectionPostgres}