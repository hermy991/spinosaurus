import {ConnectionOptions} from '../connection_options.ts'
import {IConnectionPostgresOptions} from './iconnection_postgres_options.ts'
class ConnectionPostgresOptions extends ConnectionOptions implements IConnectionPostgresOptions {
  constructor(
    public name: string,
    public type: string,
    public host: string,
    public port: number,
    public username: string,
    public password: string,
    public database: string,
    public synchronize: boolean,
    public entities: string | string[],
    public hostaddr?: string) {
      super(name, type, host, port, username, password, database, synchronize, entities);
    }
}

export {ConnectionPostgresOptions}