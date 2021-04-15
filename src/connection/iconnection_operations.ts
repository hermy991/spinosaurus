export interface IConnectionOperations {
  /* Basic SQL Operations*/
  select(... columns: Array<[string, string?]>): any;
  addSelect(column: string, as?: string): any;
  from(entity: string, as?: string): any; // ("Table", "t", ["t.column1 = 'a'"]) 
  where(... conditions: Array<Array<string>>): any; // (["column1 = 'a'"], ["column2 = 'b'"])
  addWhere(... conditions: Array<string>): any; // (["column1 = 'a'"], ["column2 = 'b'"])
  orderBy(... columns: Array<[string, string?]>): any; // (["column1"], ["column2"]) | (["column1 ASC"], ["column2 DESC"]) | (["column1", "ASC"], ["column2", "DESC"]) | (["column1", "ASC"], ["column2"])
  addOrderBy(columns: string, direction?: string): any; // ("column1") | ("column1 ASC") | ("column1", "ASC")
  /* Returns*/
  getQuery(): string;
  getRaw(): Array<any>;
  /* Returns entities*/
  getOne(): any;
  getMany(): Array<any>;
}

