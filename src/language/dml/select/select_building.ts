import {interpolate} from "../../tools/sql.ts";

class SelectBuilding {
  
  private selectData: Array<{column: string, as?: string}> = [];
  private fromData: { entity: string, schema?: string, as?: string } | null = null;
  private whereData: Array<string> = [];
  private orderByData: Array<{column: string, direction?: string}> = [];

  /*FLAGS*/
  private distinct: boolean = false;

  constructor(){  }

  selectDistinct(... columns: Array<{column: string, as?: string}>): void {
    this.distinct = true;
    this.select(... columns);
  }

  select(... columns: Array<{column: string, as?: string}>): void {
    this.selectData = [];
    columns.forEach(x => this.addSelect(x));
  }

  addSelect(req: {column: string, as?: string}): void {
    this.selectData.push(req);
  }

  from(req: {entity: string, schema?: string, as?: string }): void {
    this.fromData = req;
  }

  where(conditions: Array<string>, params?: { [x:string]: string | number | Date }) {
    this.whereData = [];
    this.addWhere(conditions, params)
  }

  addWhere(conditions: Array<string>, params?: { [x:string]: string | number | Date }){
    this.whereData.push(... interpolate(conditions, params));
  }

  orderBy(... columns: Array<{column: string, direction?: string}>): void {
    this.orderByData = [];
    columns.forEach(x => this.addOrderBy(x));
  }
  
  addOrderBy(... columns: Array<{column: string, direction?: string}>): void {
    columns.forEach(x => this.orderByData.push(x));
  }
  
  getSelectQuery(){
    if(!this.selectData.length){
      return `SELECT ${this.distinct ? "DISTINCT " : ""}* `;
    }
    let query = "";
    for(let i = 0; i < this.selectData.length; i++){
      const {column, as} = this.selectData[i];
      query += `${column}` + (as ? ` AS "${as.replaceAll(`"`, "").trim()}"` : '');
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
    let {entity, as, schema} = this.fromData;
    let query = `"${entity.replace(/["]/ig, "")}"`;
    if(schema){
      query = `"${schema.replace(/["]/ig, "")}".${query}`
    }
    if(as){
      query = `${query} AS "${as.replace(/["]/ig, "")}"`;
    }
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
      const { column, direction } = this.orderByData[i];
      query += `${column}` + (direction ? ' ' + direction.toUpperCase(): '');
      if(i + 1 !== this.orderByData.length){
        query += ", ";
      }
    }
    return `ORDER BY ${query}`;
  }

  getQuery(){
    let query = `${this.getSelectQuery()}\n${this.getFromQuery()}`;
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