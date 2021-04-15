//import {ConnectionPostgresOptions} from './connection_postgres_options.ts'
import {IConnectionPostgresOptions} from './iconnection_postgres_options.ts'
import {IConnectionPostgresOperations} from './iconnection_postgres_operations.ts'
import {SelectBuilding} from '../select/select_building.ts';
import {POOL_CONNECTIONS} from '../connection_variables.ts'
import {filterConnectionProps} from '../connection_operations.ts'
import {Pool} from 'postgres/mod.ts';
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
  getRaw(): Array<any>{
    const keyConf = {
      // applicationName";
      database: "database",
      host: "hostname",
      password: "password",
      port: "port",
      // tls?: TLSOptions,
      username: "user",
      hostaddr: "hostname"
    }
    let data: Array<any> = [];
    const driverConf = filterConnectionProps(keyConf, this);
    const pool = new Pool(driverConf, 4);


    return data;
  }
  /* Returns entities*/
  getOne(): any {
    return {};
  }
  getMany(): Array<any> {
    return [];
  }
}

export {ConnectionPostgres}