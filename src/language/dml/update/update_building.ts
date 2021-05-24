import {stringify, interpolate, clearNames} from "../../tools/sql.ts";
import {BaseBuilding} from "../base_building.ts"

/*****************************
 * TODO
 * columns(columns: Array<string>)
 * from(values: Array<any> | any, update = false)
 * use set and where in from implementation
 */
export class UpdateBuilding extends BaseBuilding {
  
  private entityData: { entity: string, schema?: string} | null = null;
  private setData: Array<[string, string | number | Date]> = [];
  private whereData: Array<string> = [];

  constructor(public conf : { delimiters: [string, string?]} = { delimiters: [`"`]}){
    super(conf);
  }

  update(req: {entity: string, schema?: string } | [string, string?]): void {
    if(Array.isArray(req)){
      let [entity, schema] = req;
      this.entityData = {entity, schema};
    }
    else {
      this.entityData = req;
    }
  }

  set(columns: Array<{column: string, expression: string | number | Date} | [string, string | number | Date]>){
    this.setData = []
    columns.forEach(x => this.addSet(x));
  }

  addSet(req: {column: string, expression: string | number | Date} | [string, string | number | Date]){
    if(Array.isArray(req)){
      let [column, expression] = req;
      this.setData.push([column, expression])
    }
    else {
      let {column, expression} = req;
      this.setData.push([column, expression])
    }
  }

  where(conditions: Array<string>, params?: { [x:string]: string | number | Date }) {
    this.whereData = [];
    this.addWhere(conditions, params)
  }

  addWhere(conditions: Array<string>, params?: { [x:string]: string | number | Date }){
    this.whereData.push(... interpolate(conditions, params));
  }
  
  getEntityQuery(){
    if(!this.entityData){
      return ``;
    }
    let {entity, schema} = this.entityData;
    let query = `${clearNames({ left: this.left, identifiers: entity, right: this.right })}`;
    if(schema){
      query = `${clearNames({ left: this.left, identifiers: [schema, entity], right: this.right })}`
    }
    return `UPDATE TABLE ${query}`;
  }
  
  getSetQuery(){
    if(!this.setData.length){
      return ``;
    }
    let columns: string[] = [];
    this.setData.forEach(col => {
      let [column, value] = col;
      let tempStr = `${clearNames({left: this.left, identifiers: column, right: this.right})} = ${stringify(value)}`;
      columns.push(tempStr);
    });
    return `SET ${columns.join(", ")}`;
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
    return `WHERE ${conditions.join(" ")}`;
  }

  getQuery(){
    let query = `${this.getEntityQuery()}\n${this.getSetQuery()}`;
    if(this.whereData.length){
      query += `\n${this.getWhereQuery()}`;
    }
    return query;
  }
}