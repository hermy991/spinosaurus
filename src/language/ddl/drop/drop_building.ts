import {BaseBuilding} from "../../base_building.ts"

export class DropBuilding extends BaseBuilding {
  
  private nameData: [string, string | undefined] | null = null;
  private columnsData: Array<string> = [];

  constructor(public conf : { delimiters: [string, string?]} = { delimiters: [`"`]},
              // public transformer: {} = {}
  ){
    super(conf);
  }

  drop(req: {entity: string, schema?: string}): void {
    let {entity, schema} = req;
    this.nameData = [`${entity.replace(/["\n\t]+/ig, "").trim()}`, schema];
  }

  columns(columns: Array<string> | string): void {
    columns = typeof columns == "string" ? [columns] : columns;
    this.columnsData = [];
    columns.forEach(x => { 
      this.addColumn(x);
    });
  }

  addColumn(column: string): void {
    column = `${column.replace(/["\n\t]+/ig, "").trim()}`
    this.columnsData.push(column);
  }

  getEntityQuery(type: "drop" | "alter"): string {
    if(!this.nameData){
      return ``;
    }
    let [entity, schema] = this.nameData;
    let query = `"${entity}"`;
    if(schema){
      query = `"${schema}"."${entity}"`;
    }
    if(type == "drop"){
      return `DROP TABLE ${query}`;
    }
    else if(type == "alter"){
      return `ALTER TABLE ${query}`;
    }
    return ``;
  }
  
  getColumnsQuery(): string {
    if(!this.columnsData.length){
      return ``;
    }
    let query = "";
    for(let i = 0; i < this.columnsData.length; i++){
      const columnName = this.columnsData[i];
      query += `DROP COLUMN "${columnName}"`;
      if(i + 1 !== this.columnsData.length){
        query += ", "
      }

    }
    return `${query}`;
  }

  getQuery(): string {
    let query = ``;
    if(this.columnsData.length){
      query = `${this.getEntityQuery('alter')}\n${this.getColumnsQuery()}`
    }
    else {
      query = `${this.getEntityQuery('drop')}`;
    }
    return query;
  }
}