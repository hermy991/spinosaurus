import {ConnectionBase} from './connection_base.ts'
import {ConnectionInterface} from './connection_interface.ts'

class ConnectionPostgres extends ConnectionBase implements ConnectionInterface {
  constructor(public name: string, 
    public type: string = "postgres",
    public host: string, 
    public port: number = 5432,
    public username: string,
    public password: string,
    public database: string,
    public synchronize: boolean = false,
    public entities: string) {
    super();
    }
  getRow() {
    let tempData: any[] = [];

    return tempData;
  }
}

export {ConnectionPostgres}