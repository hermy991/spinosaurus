//import {ConnectionPostgresOptions} from './connection_postgres_options.ts'
import {stringify} from '../../language/tools/sql.ts';
import {IConnectionPostgresOptions} from './iconnection_postgres_options.ts';
import {IConnectionPostgresOperations} from './iconnection_postgres_operations.ts';
// import {SelectBuilding} from '../../language/dml/select/select_building.ts';
import {SpiColumnDefinition} from '../executors/types/spi_column_definition.ts';
import {SpiColumnComment} from '../executors/types/spi_column_comment.ts';
import {initConnection} from './connection_postgres_pool.ts';
import {filterConnectionProps} from '../connection_operations.ts';
import {MetadataStore} from '../../decorators/metadata/metadata_store.ts';
import {EntityOptions} from '../../decorators/options/entity_options.ts';
import {ColumnOptions} from '../../decorators/options/column_options.ts';
import {ColumnType} from '../../decorators/options/column_type.ts';
import {postgres} from '../../../deps.ts';
import {KEY_CONFIG} from './connection_postgres_variables.ts';

class ConnectionPostgres implements IConnectionPostgresOptions, IConnectionPostgresOperations {

  delimiters: [string, string?] = [`"`];
  transformer = {
    
  }

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
  ) {
    this.transformer = { 
      columnDefinition: this.columnDefinition,
    };
  }
  /* Basic Connection Operations*/
  columnDefinition(scd: SpiColumnDefinition): string  {
    /**
     * Column definition
     */
    const defs :string[] = [];
    defs.push(scd.columnName);
    defs.push(this.getDbColumnType(scd).toUpperCase());
    if(scd.nullable == false)
      defs.push(`NOT NULL`);
    return defs.join(" ");
  }
  columnComment(scc: SpiColumnComment): string {
    const { schema, entity, columnName, comment } = scc;
    let sql = `COMMENT ON COLUMN ${ schema ? schema+"." : "" }${ entity }.${ columnName } IS `;
    sql += `${ comment === null || comment === undefined ? 'NULL' : stringify(comment) }`;
    return sql;
  }
  columnAlter(from: {schema?: string, entity: string, columnName: string}, changes: SpiColumnDefinition): string[] {
    const {schema, entity, columnName} = from;
    const querys: string[] = [];
    const efrom = `${schema ? schema+".":""}${entity}`;
    if(changes.columnName && columnName != changes.columnName){
      querys.push(`${efrom} RENAME COLUMN ${columnName} TO ${changes.columnName}`);
    }
    // if(type){
      //   let newType = `${type.toUpperCase()}`;
      //   if(precision){
      //     let psArr: (string|number)[] = [precision];
      //     scale ? psArr.push(scale) : undefined;
      //     length ? psArr.push(length) : undefined;
      //     newType += `(${psArr.join(", ")})`;
      //   }
      //   querys.push(`${ename} ALTER COLUMN ${columnName} TYPE ${newType}`);
      // }
      return querys;
  }

  async test(): Promise<boolean> {
    const driverConf = filterConnectionProps(KEY_CONFIG, this);
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
  
  async checkObject(req: { name: string, schema?: string, database?: string }): Promise<{ name: string, schema?: string, database?: string, exists: boolean, oid?: number, dbdata?: any, type?: string }> {
    let res: { name: string, schema?: string, database?: string, exists: boolean, oid?: number, dbdata?: any, type?: string } = 
             { name: req.name, schema: req.schema, database: req.database, exists: false };
    req.name = req.name.replace(/'/ig, "''");
    req.schema = (req.schema || "").replace(/'/ig, "''");
    /**
     * TODO
     * buscar el schema por defecto en el query
     */
    const query = `
SELECT n."oid"
    , current_database() "database"
    , n."nspname" "schema"
    , c."relname" "name"
    , c."relkind" "type"
FROM pg_catalog.pg_class c
INNER JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname not in ('pg_catalog', 'information_schema', 'pg_toast')
  AND n.nspname = CASE WHEN '${req.schema}' = '' THEN current_schema() ELSE '${req.schema}' END -- schema
  AND c.relname = '${req.name}' -- object
    `;
    const result = await this.execute(query, req.database ? {database: req.database} : undefined);
    const rows = result.rows;
    let type;
    if(rows.length){
      switch(rows[0].type) {
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
      res = { name: rows[0].name, 
        schema: rows[0].schema, 
        database: rows[0].database, 
        exists: true,
        oid: rows[0].oid,
        dbdata: rows[0],
        type
      }
      return res;
    }
    // let res = { ...req,  
    //   exists: rows.length > 0,
    //   oid: rows.length ? Number(rows[0].oid) : undefined,
    //   dbdata: rows.length ? rows[0] : undefined,
    //   type: rows.length ? type : undefined
    // };
    return res;
  }

  async getCurrentDatabase(changes?: {database?: string}): Promise<string> {
    let schema = "";
    const query = "SELECT current_database() current_database";
    const result = await this.execute(query, changes);
    const rows = result.rows;
    if(rows.length)
      schema = rows[0].current_database;
    return schema;
  }

  async getCurrentSchema(): Promise<string> {
    let schema = "";
    const query = `SELECT current_schema() "current_schema"`;
    const result = await this.execute(query);
    const rows = result.rows;
    if(rows.length)
      schema = rows[0].current_schema;
    else
      schema = "public";
    return schema;
  }

  getDbColumnType(req: { spitype: ColumnType, length?: number, precision?: number, scale?: number }): string{
    const { spitype, length, precision, scale} = req;
    let columnType: string;
    if(["bytearray"].includes(spitype))
      columnType = "bytea";
    else if(["varchar"].includes(spitype) && length)
      columnType = `character varying (${length})`;
    else if(["numeric"].includes(spitype) && precision && scale)
      columnType = `numeric (${precision},${scale})`;
    else if(["numeric"].includes(spitype) && precision)
      columnType = `numeric (${precision})`;
    else if(["numeric"].includes(spitype) && !precision && length == 8)
      columnType = `bigint`;
    else if(["numeric"].includes(spitype) && !precision && length == 4)
      columnType = `integer`;
    else if(["numeric"].includes(spitype) && !precision && length == 2)
      columnType = `smallint`;
    else
      columnType = spitype;
    return columnType;
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
      const type = {columnType: <string>row.data_type, length:<number>row.character_maximum_length, precision: <number>row.numeric_precision, scale: <number>row.numeric_scale };
      let column = { 
        // target,
        entity: { name: <string>row.table_name },
        // descriptor,
        // property,
        // options,
        mixeds: <ColumnOptions> {
                      type: this.getColumnTypeReverse(type),
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

  getColumnTypeReverse(req: {columnType: string, length?: number, precision?: number, scale?: number}) {
    const {columnType, length/*, precision, scale*/} = req;
    let r: ColumnType;
    const charAlikes = ["character", "character varying", "inet", "uuid", "macaddr", "macaddr8", "jsonb", "json", "xml", "cidr"];
    if(columnType == "bit")
      r = "boolean";
    else if(columnType == "bytea")
      r = "bytearray";
    else if(length && charAlikes.includes(columnType))
      r = "varchar";
    else if(charAlikes.includes(columnType))
      r = "text";
    else if(["double precision", "real", "money"].includes(columnType))
      r = "numeric";
    // else if(scale && ["numeric"].includes(columnType))
    //   r = "integer";
    else 
      r = <ColumnType>columnType;
      
    if(!r)
      return;
    return r;
  }
  
  async execute(query: string, changes?: any): Promise<any> {
    const driverConf = filterConnectionProps(KEY_CONFIG, this, changes);
    const pool = (initConnection(driverConf) as postgres.Pool);
    const client = await pool.connect();
    const result = await client.queryObject(query);
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
    const driverConf = filterConnectionProps(KEY_CONFIG, this);
    const pool = (initConnection(driverConf) as postgres.Pool);
    const client = await pool.connect();
    //const query = this.getQuery();
    const result = await client.queryObject(query);
    client.release();
    await pool.end();
    return result.rows;
  }
  async getRawMultiple(query: string): Promise<Array<any>> {
    const driverConf = filterConnectionProps(KEY_CONFIG, this);
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