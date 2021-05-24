import {interpolate, clearNames} from "../../tools/sql.ts";
import {BaseBuilding} from "../base_building.ts"

export class SelectBuilding extends BaseBuilding {
  
  private selectData: Array<{column: string, as?: string}> = [];
  private fromData: { entity: string, schema?: string, as?: string } | null = null;
  private whereData: Array<string> = [];
  private orderByData: Array<{column: string, direction?: string}> = [];

  /*FLAGS*/
  private distinct: boolean = false;

  constructor(public conf : { delimiters: [string, string?]}){
    super(conf);
  }

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
    let columns: string[] = [];
    for(let i = 0; i < this.selectData.length; i++){
      const {column, as} = this.selectData[i];
      let tempCol = `${column}` + (as ? ` AS ${clearNames({left: this.left, identifiers: as, right: this.right})}` : '');
      columns.push(tempCol);
    }
    return `SELECT ${this.distinct ? "DISTINCT " : ""}${columns.join(", ")}`;
  }
  
  getFromQuery(){
    if(!this.fromData){
      return ``;
    }
    let {entity, schema, as} = this.fromData;
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
    let conditions: string[] = [];
    for(let i = 0; i<this.whereData.length; i++){
      let tempWhere = this.whereData[i];
      conditions.push(tempWhere);
    }
    return `WHERE ${conditions.join(" ")}` ;
  }
  
  getOrderByQuery(){
    if(!this.orderByData.length){
      return ``;
    }
    let orders: string[] = [];
    for(let i = 0; i < this.orderByData.length; i++){
      const { column, direction } = this.orderByData[i];
      let tempOrder = `${column}` + (direction ? ' ' + direction.toUpperCase(): '');
      orders.push(tempOrder);
    }
    return `ORDER BY ${orders.join(", ")}`;
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