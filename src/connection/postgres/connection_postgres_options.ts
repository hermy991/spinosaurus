import {ConnectionInterface} from '../connection_interface.ts'

class ConnectionPostgresOptions implements ConnectionInterface {
  constructor(public name: string, 
    public type: string = "postgres",
    public host: string = "localhost", 
    public port: number = 5432,
    public username: string,
    public password: string,
    public database: string,
    public synchronize: boolean = false,
    public entities: string,
    /* Connection Specific Options */
    public hostaddr: string
    ) {    }
}

export {ConnectionPostgresOptions}