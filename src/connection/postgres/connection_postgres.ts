//import {ConnectionPostgresOptions} from './connection_postgres_options.ts'
import {IConnectionPostgresOptions} from './iconnection_postgres_options.ts'
import {IConnectionPostgresOperations} from './iconnection_postgres_operations.ts'
import {SelectBuilding} from '../../language/dml/select/select_building.ts';
import {initConnection} from './connection_postgres_pool.ts';
import {filterConnectionProps} from '../connection_operations.ts'
import {MetadataStore} from '../../decorators/metadata/metadata_store.ts';
import {EntityOptions} from '../../decorators/options/entity_options.ts'
import {ColumnOptions} from '../../decorators/options/column_options.ts'
import {ColumnType} from '../../decorators/options/column_type.ts'
import {postgres} from '../../../deps.ts';
import {KEY_CONFIG} from './connection_postgres_variables.ts'

class ConnectionPostgres implements IConnectionPostgresOptions, IConnectionPostgresOperations {

  delimiters: [string, string?] = [`"`];

  constructor(public name: string,
    public type: string = "postgres",
    public host: string = "localhost",
    public port: number = 5432,
    public username: string,
    public password: string,
    public database: string,
    public synchronize: boolean = false,
    public entities: string | string[],
    public hostaddr?: string
  ) {    }
  /* Basic Connection Operations*/
  
  async test(): Promise<boolean> {
    let driverConf = filterConnectionProps(KEY_CONFIG, this);
    try{
      const pool = (initConnection(driverConf) as postgres.Pool);
      const client = await pool.connect();
      // const query = this.getQuery()
      client.release();
      await pool.end();
      return true;
    }
    catch(err){
      return false;
    }
  }
  
  async checkObject(req: { name: string, namespace?: string }): Promise<{ name: string, namespace?: string, exists: boolean, oid?: number, dbdata?: any, type?: string }> {
    req.name = req.name.replace(/'/ig, "''");
    req.namespace = (req.namespace || "public").replace(/'/ig, "''");
    /**
     * TODO
     * buscar el schema por defecto en el query
     */
    const query = `
SELECT * 
FROM pg_catalog.pg_class c
INNER JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname not in ('pg_catalog', 'information_schema')
  AND n.nspname = '${req.namespace}'
  AND c.relname = '${req.name}'
    `;
    const result = await this.execute(query);
    const rows = result.rows;
    let type = "";
    if(rows.length){
      switch(rows[0].relkind) {
        /*
        r = ordinary table, 
        i = index, 
        S = sequence, 
        t = TOAST table, 
        v = view, 
        m = materialized view, 
        c = composite type, 
        f = foreign table, 
        p = partitioned table, 
        I = partitioned index
        */ 
        case "r": type = "table"; break;
        case "i": type = "index"; break;
        case "S": type = "sequence"; break;
        case "t": type = "toast table"; break;
        case "v": type = "view"; break;
        case "m": type = "materialized view"; break;
        case "c": type = "type"; break;
        case "f": type = "foreign table"; break;
        case "p": type = "partitioned table"; break;
        case "I": type = "partitioned index"; break;
      }
    }
    let res = { ...req,  
      exists: rows.length > 0,
      oid: rows.length ? Number(rows[0].oid) : undefined,
      dbdata: rows.length ? rows[0] : undefined,
      type: rows.length ? type : undefined
    };
    return res;
  }

  async getCurrentSchema(): Promise<string> {
    let schema = "";
    const query = "SELECT current_schema()";
    const result = await this.execute(query);
    const rows = result.rows;
    if(rows.length)
      schema = rows[0].current_schema;
    else
      schema = "public";
    return schema;
  }

  async getMetadata(): Promise<MetadataStore>{
    const metadata: MetadataStore = new MetadataStore();
    const query = `
SELECT *
FROM information_schema.columns c 
WHERE c.table_schema NOT IN ('pg_catalog', 'information_schema')
    `;
    const result = await this.execute(query);
    let rows: any[] = result.rows;
    rows = rows.sort((a, b) => <number>a.ordinal_position < <number>b.ordinal_position ? -1 : <number>a.ordinal_position > <number>b.ordinal_position ? 1 : 0)
               .sort((a, b) => <string>a.table_name < <string>b.table_name ? -1 : <string>a.table_name > <string>b.table_name ? 1 : 0)
               .sort((a, b) => <string>a.table_schema < <string>b.table_schema ? -1 : <string>a.table_schema > <string>b.table_schema ? 1 : 0)
               .sort((a, b) => <string>a.table_catalog < <string>b.table_catalog ? -1 : <string>a.table_catalog > <string>b.table_catalog ? 1 : 0);
    for(let i = 0; i<rows.length; i++){
      const row = rows[i];
      let table = metadata.tables.find(x => x.mixeds!.name = row.table_name);
      if(!table){
        let mixeds: EntityOptions = { 
          database: <string>row.table_catalog,
          schema: <string>row.table_schema,
          name: <string>row.table_name
        };
        metadata.tables.push({
          // target,
          // options,
          mixeds,
          columns: []
        });
        table = metadata.tables[metadata.tables.length - 1];
      }
      let column = { 
        // target,
        entity: { name: <string>row.table_name },
        // descriptor,
        // property,
        // options,
        mixeds: <ColumnOptions> {
                      type: this.getColumnTypeReverse(<string>row.data_type),
                      name: <string>row.column_name,
                      length: <number>row.character_maximum_length,
                      nullable: row.is_nullable == "YES",
                      // default: "??"
                    }
      };
      table.columns.push(column);
      metadata.columns.push(column);
    }




    return metadata;
  }

  getColumnTypeReverse(columnType: string) {
    let r: ColumnType = "text";

    

    return r;
  }
  
  async execute(query: string): Promise<any> {
    const driverConf = filterConnectionProps(KEY_CONFIG, this);
    const pool = (initConnection(driverConf) as postgres.Pool);
    const client = await pool.connect();
    //const query = this.getQuery();
    const result = await client.queryArray(query);
    client.release();
    await pool.end();
    return result;
  }

  async getOne(query: string): Promise<any> {
    return {};
  }
  async getRawOne(query: string): Promise<any> {
    const rows = await this.getRawMany(query);
    return rows.length ? rows[0] : null;
  }
  async getMany(query: string): Promise<Array<any>> {
    return [];
  }
  async getRawMany(query: string): Promise<Array<any>> {
    let driverConf = filterConnectionProps(KEY_CONFIG, this);
    const pool = (initConnection(driverConf) as postgres.Pool);
    const client = await pool.connect();
    //const query = this.getQuery();
    const result = await client.queryObject(query);
    client.release();
    await pool.end();
    return result.rows;
  }
  async getRawMultiple(query: string): Promise<Array<any>> {
    let driverConf = filterConnectionProps(KEY_CONFIG, this);
    const pool = (initConnection(driverConf) as postgres.Pool);
    const client = await pool.connect();
    // const query = this.getQuery();
    const result = await client.queryObject(query);
    client.release();
    await pool.end();
    return result.rows;
  }
  /* Returns entities*/
}

export {ConnectionPostgres}