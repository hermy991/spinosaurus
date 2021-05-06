import {SelectOperations} from './select_operations.ts';
class SelectBuilding {
  
  private selectData: Array<[string, string?]> = [];
  private fromData: [string, string?] | null = null;
  private whereData: Array<string> = [];
  private orderByData: Array<[string, string?]> = [];

  /*FLAGS*/
  private distinct: boolean = false;

  constructor(){  }

  selectDistinct(... columns: Array<[string, string?]>): void {
    this.distinct = true;
    this.select(... columns);
  }

  select(... columns: Array<[string, string?]>): void {
    this.selectData = [];
    // columns.forEach(x => this.selectData.push(x) );
    columns.forEach(x => this.addSelect(x[0], x.length > 1 ? x[1]: undefined));
  }

  addSelect(column: string, as?: string): void {
    const currColumn: [string, string?] = [column]
    if(as){
      as = `"${as.replaceAll(`"`, "").trim()}"`;
      currColumn.push(as);
    }
    this.selectData.push(currColumn);
  }

  from(entity: string, as?: string): void {
    this.fromData = [entity, as];
  }

  where(... conditions: Array<string>) {
    this.whereData = [];
    conditions.forEach(x => this.addWhere(x));
  }

  addWhere(condition: string){
    if(condition && condition.trim()){
      this.whereData.push(condition.trim());
    }
  }

  orderBy(... columns: Array<[string, string?]>): void {
    this.orderByData = [];
    // columns.forEach(x => this.selectData.push(x) );
    columns.forEach(x => this.addOrderBy(x[0], x.length > 1 ? x[1]: undefined));
  }
  
  addOrderBy(column: string, as?: string): void {
    const currColumn: [string, string?] = [column]
    if(as){
      as = `${as.replaceAll(`"`, "").trim()}`;
      currColumn.push(as);
    }
    this.orderByData.push(currColumn);
  }
  
  getSelectQuery(){
    if(!this.selectData.length){
      return `SELECT ${this.distinct ? "DISTINCT " : ""}* `;
    }
    let query = "";
    for(let i = 0; i < this.selectData.length; i++){
      const [column, as] = this.selectData[i];
      query += `${column}` + (as ? ' AS ' + as: '');
      if(i + 1 !== this.selectData.length){
        query += ", "
      }
    }
    return `SELECT ${this.distinct ? "DISTINCT " : ""}${query}`;
  }
  
  getFromQuery(){
    if(!this.fromData){
      return ``;
    }
    let [from, as] = this.fromData;
    let query = `${from}${as ? ' AS "' + as + '"': ''}`;
    return `FROM ${query}`;
  }

  getWhereQuery(){
    if(!this.whereData.length){
      return ``;
    }
    let query = ``;
    for(let i = 0; i<this.whereData.length; i++){
      query += this.whereData[i];
      if(i + 1 !== this.whereData.length){
        query += " ";
      }
    }
    return `WHERE ${query}` ;
  }
  
  getOrderByQuery(){
    if(!this.orderByData.length){
      return ``;
    }
    let query = "";
    for(let i = 0; i < this.orderByData.length; i++){
      const [column, as] = this.orderByData[i];
      query += `${column}` + (as ? ' ' + as.toUpperCase(): '');
      if(i + 1 !== this.orderByData.length){
        query += ", ";
      }
    }
    return `ORDER BY ${query}`;
  }

  getQuery(){
    let query = `\n${this.getSelectQuery()}\n${this.getFromQuery()}`;
    if(this.whereData.length){
      query += `\n${this.getWhereQuery()}`;
    }
    if(this.orderByData.length){
      query += `\n${this.getOrderByQuery()}`;
    }
    return query;
  }
}
export {SelectBuilding}