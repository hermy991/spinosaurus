import {DropOperations} from './drop_operations.ts';
class DropBuilding {
  
  private nameData: [string, string | undefined] | null = null;
  private columnsData: Array<string> = [];

  /*FLAGS*/

  constructor(){  }


  drop(entity: string, schema?: string): void {
    this.nameData = [`${entity.replace(/["\n\t]+/ig, "").trim()}`, schema];
  }

  columns(... columns: Array<string>): void {
    this.columnsData = [];
    columns.forEach(x => { 
      this.addColumn(x);
    });
  }

  addColumn(column: string): void {
    column = `${column.replace(/["\n\t]+/ig, "").trim()}`
    this.columnsData.push(column);
  }

  getEntityQuery(type: "drop" | "alter"){
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
  }
  
  getColumnsQuery(){
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

  getQuery(){
    let query = ``;
    if(this.columns.length){
      query = `${this.getEntityQuery('alter')}\n${this.getColumnsQuery}`
    }
    else {
      query = `${this.getEntityQuery('drop')}`;
    }
    return query;
  }
}
export {DropBuilding}