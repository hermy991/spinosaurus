import {stringify, interpolate, clearNames} from "../../tools/sql.ts";
import {BaseBuilding} from "../base_building.ts"
/*****************************
 * TODO
 * columns(columns: Array<string>)
 * from(values: Array<any> | any, update = false)
 * use set and where in from implementation
 */
export class InsertBuilding extends BaseBuilding {
  
  private entityData: { entity: string, schema?: string} | null = null;
  private valuesData: Array<any> = [];

  constructor(public conf : { delimiters: [string, string?]} = { delimiters: [`"`]}){
    super(conf);
  }

  insert(req: {entity: string, schema?: string } | [string, string?]): void {
    if(Array.isArray(req)){
      let [entity, schema] = req;
      this.entityData = {entity, schema};
    }
    else {
      this.entityData = req;
    }
  }
  values(data: Array<any> | any){
    this.addValues(data);
  }
  addValues(data: Array<any> | any){
    data = Array.isArray(data) ? data : [data];
    this.valuesData.push(... data);
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
    return `INSERT INTO ${query}`;
  }
  
  getColumnsQuery(){
    if(!this.valuesData.length){
      return ``;
    }
    let columns: Set<string> = new Set();
    this.valuesData.forEach(value => {
      let keys = Object.keys(value);
      keys.forEach(key => columns.add(clearNames({ left: this.left, identifiers: key, right: this.right })));
    });
    return `(${[... columns].join(", ")})`;
  }

  getValueQuery(obj: any){
    let columns: string[] = [];
    for(let value of obj){
      columns.push(stringify(value));
    }
    if(!columns.length){
      return undefined;
    }
    return `(${columns.join(", ")})`;
  }

  getValuesQuery(data: Array<any> | any){
    data = Array.isArray(data) ? data : [data];
    let objs: Array<string> = [];
    for(let obj of data){
      let value = this.getValueQuery(obj);
      if(value){
        objs.push(value);
      }
    }
    return `VALUES ${objs.join(", ")}`
  }

  getQuery(){
    if(!this.valuesData.length){
      return ``;
    }
    let inserts: string[] = [];
    this.valuesData.forEach(x => inserts.push(`${this.getEntityQuery()}\n${this.getColumnsQuery()}\n${this.getValuesQuery(x)}`));
    return inserts.join(";\n");
  }
}