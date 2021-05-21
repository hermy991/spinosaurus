export class CreateBuilding {
  
  private nameData: [string, string | undefined] | null = null;
  private columnsData: Array<{ columnName: string, datatype: string, length?: number, nulleable?:boolean }> = [];

  /*FLAGS*/

  constructor(){  }

  create(req: {entity: string, schema?: string}): void {
    let {entity, schema} = req;
    this.nameData = [`${entity.replace(/["\n\t]+/ig, "")}`, schema];
  }

  columns(... columns: Array<{ columnName: string, datatype: string, length?: number, nulleable?:boolean }>): void {
    this.columnsData = [];
    columns.forEach(x => { 
      this.addColumn(x);
    });
  }

  addColumn(column: { columnName: string, datatype: string, length?: number, nulleable?:boolean }): void {
    column.columnName = `${column.columnName.replace(/["\n\t]+/ig, "")}`
    if(typeof column.length == "number" && column.length <= 0){
      column.length = undefined;
    }
    this.columnsData.push(column);
  }

  getNameQuery(){
    if(!this.nameData){
      return ``;
    }
    let [entity, schema] = this.nameData;
    let query = `"${entity}"`;
    if(schema){
      query = `"${schema}"."${entity}"`;
    }
    return `CREATE TABLE ${query}`;
  }
  
  getColumnsQuery(){
    if(!this.columnsData.length){
      return ``;
    }
    let query = "";
    for(let i = 0; i < this.columnsData.length; i++){

      const {columnName, datatype, length, nulleable} = this.columnsData[i];
      query += `"${columnName}"`;
      if(length){
        query += ` ${datatype.toUpperCase().trim()}(${length})`;
      }
      else {
        query += ` ${datatype.toUpperCase().trim()}`;
      }
      /** NOT NULL */
      if(nulleable === false){
        query += ` NOT NULL`;
      }
      if(i + 1 !== this.columnsData.length){
        query += ", "
      }

    }
    return `( ${query} )`;
  }

  getQuery(){
    let query = `${this.getNameQuery()}\n${this.getColumnsQuery()}`;
    return query;
  }
}