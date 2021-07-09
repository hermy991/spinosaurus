import {stringify, interpolate, clearNames} from "../../tools/sql.ts";
import {BaseBuilding} from "../../base_building.ts"

/*****************************
 * TODO
 * columns(columns: Array<string>)
 * from(values: Array<any> | any, update = false)
 * use set and where in from implementation
 */
export class DeleteBuilding extends BaseBuilding {
  
  private entityData: { entity: string, schema?: string} | null = null;
  private whereData: Array<string> = [];

  constructor(public conf : { delimiters: [string, string?]} = { delimiters: [`"`]},
              // public transformer: {} = {}
  ){
    super(conf);
  }

  delete(req: {entity: string, schema?: string } | [string, string?]): void {
    if(Array.isArray(req)){
      let [entity, schema] = req;
      this.entityData = {entity, schema};
    }
    else {
      this.entityData = req;
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
    return `DELETE FROM ${query}`;
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
    let query = `${this.getEntityQuery()}`;
    if(this.whereData.length){
      query += `\n${this.getWhereQuery()}`;
    }
    return query;
  }
}