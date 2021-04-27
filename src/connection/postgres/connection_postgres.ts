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
  select(... columns: Array<[string, string?]>): void {
    this.sb.select(... columns);
  };
  addSelect(column: string, as?: string): void {
    this.sb.addSelect(column, as);
  };
  from(entity: string, as?: string): any {
    this.sb.from(entity, as);
  }
  where(... conditions: Array<Array<string>>): any {
    throw Error("Method not implemented");

  }
  addWhere(... conditions: Array<string>): any {
    throw Error("Method not implemented");

  }
  orderBy(... columns: Array<[string, string?]>): any {
    throw Error("Method not implemented");

  }
  addOrderBy(columns: string, direction?: string): any {
    throw Error("Method not implemented");

  }
  /* Returns*/
  getQuery(): string {
    return this.sb.getQuery();
  }
  async getRaw(): Promise<Array<any>> {
    const driverConf = filterConnectionProps(KEY_CONFIG, this);
    // console.log({driverConf})
    const pool = (initConnection(driverConf) as Pool);
    const client = await pool.connect();
    const query = this.getQuery()
    const result = await client.queryObject(query);
    client.release();
    //Promise pro = 
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