// import {path} from "../../../deps.ts";
import {fs} from "../../../deps.ts";
import {ConnectionPostgresOptions} from '../postgres/connection_postgres_options.ts'
import {Connection} from "../connection.ts";

export async function createConnection(conn?: ConnectionPostgresOptions | Array<ConnectionPostgresOptions>, def: number | string = 0 ) {
  const tconn = new Connection(conn, def);
  await synchronize(tconn);
  return tconn;
}

export async function synchronize(conn: Connection){
  const defConn = conn.connections[conn.defIndex];
  if(defConn.synchronize){
    const entities = typeof defConn.entities == "string" ? [defConn.entities] : defConn.entities;
    await updateStore(entities);

  }
}

export async function updateStore(entities: string []){
  for(const entity of entities){
    for await (const file of fs.expandGlob(entity)){
      const path = file.path.replaceAll(`\\`, `/`).replaceAll(`C:/`, `/`);
      await import (path);
    }
  }
}