import {ConnectionPostgresOptions} from './connection_postgres_options.ts'

class ConnectionPostgres extends ConnectionPostgresOptions {
  constructor(public name: string, 
    public type: string = "postgres", 
    public host: string = "localhost", 
    public port: number = 5432,
    public username: string,
    public password: string,
    public database: string,
    public synchronize: boolean = false,
    public entities: string,
    public hostaddr: string) {
    super(name, type, host, port, username, password, database, synchronize, entities, hostaddr);
    }
  public getQuery(): string {
    return this.getQuery();
  }
  public getRow() {
    let tempData: any[] = [];

    return tempData;
  }
}

export {ConnectionPostgres}