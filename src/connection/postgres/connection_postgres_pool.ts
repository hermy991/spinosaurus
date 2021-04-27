// import {Pool} from 'postgres/mod.ts'
import {Pool} from '../../../deps.ts'
import {POOL_CONNECTIONS} from '../connection_variables.ts'

const POSTGRES_POOL: Array<Pool> = [];

export function initConnection(driverConf: any): Pool {
  if(!POSTGRES_POOL.length){
    POSTGRES_POOL.push(
      new Pool(driverConf, POOL_CONNECTIONS));
  }
  return POSTGRES_POOL[0];
}

export function replaceConnection(driverConf: any): Pool {
  if(!POSTGRES_POOL.length){
    initConnection(driverConf);
  }
  else {
    POSTGRES_POOL[0] = new Pool(driverConf, POOL_CONNECTIONS);
  }
  return POSTGRES_POOL[0];
}