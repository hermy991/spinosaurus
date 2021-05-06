//import {ConnectionPostgresOptions} from './connection_postgres_options.ts'
import {IConnectionPostgresOptions} from './iconnection_postgres_options.ts'
import {IConnectionPostgresOperations} from './iconnection_postgres_operations.ts'
import {SelectBuilding} from '../select/select_building.ts';
import {initConnection} from './connection_postgres_pool.ts';
import {filterConnectionProps} from '../connection_operations.ts'
//import {Pool} from 'postgres/mod.ts';
import {Pool} from '../../../deps.ts';
import {KEY_CONFIG} from './connection_postgres_variables.ts'
class ConnectionPostgres implements IConnectionPostgresOptions, IConnectionPostgresOperations {
  sb: SelectBuilding = new SelectBuilding();
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
      const pool = (initConnection(driverConf) as Pool);
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
  /* Basic SQL Operations*/

  selectDistinct(... columns: Array<[string, string?]>): void {
    this.sb.selectDistinct(... columns);
  };
  select(... columns: Array<[string, string?]>): void {
    this.sb.select(... columns);
  };
  addSelect(column: string, as?: string): void {
    this.sb.addSelect(column, as);
  };
  from(entity: string, as?: string): void {
    this.sb.from(entity, as);
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
    return this.sb.getQuery();
  }
  async getRaw(): Promise<Array<any>> {
    let driverConf = filterConnectionProps(KEY_CONFIG, this);
    // console.log({driverConf})
    // driverConf["tls"] = { enforce: false };
    const pool = (initConnection(driverConf) as Pool);
    const client = await pool.connect();
    const query = this.getQuery()
    const result = await client.queryObject(query);
    client.release();
    await pool.end();
    return result.rows;
  }
  async getRawArray(): Promise<Array<any>> {
    const driverConf = filterConnectionProps(KEY_CONFIG, this);
    // console.log({driverConf})
    const pool = (initConnection(driverConf) as Pool);
    const client = await pool.connect();
    const query = this.getQuery()
    const result = await client.queryArray(query);
    client.release();
    //Promise pro = 
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