import {BaseBuilding} from "../../base_building.ts";
export class AlterBuilding extends BaseBuilding {
  
  private fromData: [string, string?] | undefined = undefined;
  private columnsData: Array<[string, { columnName: string, datatype: string, length?: number, nulleable?:boolean }]> = [];

  constructor(public conf : { delimiters: [string, string?]} = { delimiters: [`"`]}){
    super(conf);
  }

  rename(from: {entity: string, schema?: string}): void {
    this.fromData = [`${from.entity.replace(/["\n\t]+/ig, "").trim()}`, from.schema];
  }

  columns(... columns: Array<[string, { columnName: string, datatype: string, length?: number, nulleable?:boolean }]>): void {
    this.columnsData = [];
    columns.forEach(x => { 
      this.addColumn(x);
    });
  }

  addColumn(column: [string, { columnName: string, datatype: string, length?: number, nulleable?:boolean }]): void {
    this.columnsData.push(column);
  }

  getEntityParts(){
    let o: {from?: string, to?: string} = {};
    if(!this.fromData){
      return {};
    }
    let [fentity, fschema] = this.fromData;
    let tentity = this.changeData?.[0]; let tschema = this.changeData?.[1];
    tschema ||= fschema;

    o.from = `"${fentity}"`;
    if(fschema){
      o.from = `"${fschema}"."${fentity}"`;
    }
    if(this.changeData){
      o.to = `"${tentity}"`;
      if(tschema){
        o.to = `"${tschema}"."${tentity}"`;
      }
    }
    return o;
  }

  getEntityQuery(): string {
    if(!this.fromData && !this.changeData){
      return ``;
    }
    let { from, to } = this.getEntityParts();
    return `ALTER TABLE ${from} RENAME TO ${to}`;
  }
  
  getColumnsQuery(): string {
    if(!this.columnsData.length){
      return ``;
    }
    let query = ``;
    let o = this.getEntityParts();
    let ename = o.from;
    if(o.to){
      ename = o.to;
    }

    for(let i = 0; i < this.columnsData.length; i++){
      const [from, to] = this.columnsData[i];
      query += `ALTER TABLE ${ename} RENAME COLUMN "${from}" TO "${to}"`;
      if(i + 1 != this.columnsData.length){
        query += `;\n`;
      }
      // else if(o.to){
      //   query += `;`;
      // }
    }
    return `${query}`;
  }

  getQuery(): string {
    let query = ``;
    if(this.changeData){
      query += `${this.getEntityQuery()}`;
    }
    if(this.columnsData.length){
      query += `${this.changeData ? `;\n` : ``}${this.getColumnsQuery()}`
    }
    return query;
  }
}