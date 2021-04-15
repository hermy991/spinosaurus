import {IConnectionPostgresOptions} from './iconnection_postgres_options.ts'
import {IConnectionPostgresOperations} from './iconnection_postgres_operations.ts'
class ConnectionPostgres implements IConnectionPostgresOptions, IConnectionPostgresOperations {
  
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
  select(... conditions: Array<Array<string>>): any {
    throw Error("Method not implemented");
  };
  addSelect(column: string, as?: string): any {
    throw Error("Method not implemented");
  };
  from(entity: string, as?: string): any {
    throw Error("Method not implemented");
    
  }
  where(... conditions: Array<Array<string>>): any {
    throw Error("Method not implemented");

  }
  addWhere(... conditions: Array<string>): any {
    throw Error("Method not implemented");

  }
  orderBy(... columns: Array<Array<string>>): any {
    throw Error("Method not implemented");

  }
  addOrderBy(columns: string, direction?: string): any {
    throw Error("Method not implemented");

  }
  /* Returns*/
  getQuery(): string {
    return "";
  }
  getRaw(): Array<any>{
    return [];
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