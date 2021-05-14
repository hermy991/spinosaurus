export interface IConnectionOperations {
  /* Basic Connection Operations*/
  test(): Promise<boolean>;
  checkObject(req: { name: string, namespace?: string }): Promise<{ name: string, namespace?: string, exists: boolean, oid?: number, dbdata?: any, type?: string }>;
  /* DDL SQL Operations*/
  create(entity: string, schema?: string): any;
  columns(... columns: Array<{ columnName: string, datatype: string, length?: number, nulleable?:boolean }>): any;
  addColumn(columnName: string, datatype: string, length?: number, nulleable?:boolean): any;
  drop(entity: string, schema?: string): any;
  /* DML SQL Operations*/
  selectDistinct(... columns: Array<[string, string?]>): any;
  select(... columns: Array<[string, string?]>): any;
  addSelect(column: string, as?: string): any;
  from(entity: string, as?: string, schema?: string): any; // ("Table", "t", ["t.column1 = 'a'"]) 
  where(... conditions: Array<string>): any; // (["column1 = 'a'"], ["column2 = 'b'"])
  addWhere(condition: string): any; // (["column1 = 'a'"], ["column2 = 'b'"])
  orderBy(... columns: Array<[string, string?]>): any; // (["column1"], ["column2"]) | (["column1 ASC"], ["column2 DESC"]) | (["column1", "ASC"], ["column2", "DESC"]) | (["column1", "ASC"], ["column2"])
  addOrderBy(columns: string, direction?: string): any; // ("column1") | ("column1 ASC") | ("column1", "ASC")
  /* Returns*/
  execute(): Promise<any>;
  getQuery(): string;
  getRawOne(): Promise<Array<any>>;
  getRawMany(): Promise<Array<any>>;
  getRawMultiple(): Promise<Array<any>>;
  /* Returns entities*/
  getOne(): Promise<any>;
  getMany(): Promise<Array<any>>;
}

