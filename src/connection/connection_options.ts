import {IConnectionOptions} from './iconnection_options.ts'

class ConnectionOptions implements IConnectionOptions {
  constructor(
    public name: string,
    public type: string,
    public host: string,
    public port: number,
    public username: string,
    public password: string,
    public database: string,
    public synchronize: boolean,
    public entities: string) {}
}

export {ConnectionOptions}