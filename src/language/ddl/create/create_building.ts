import {BaseBuilding} from "../../base_building.ts"
import {InsertBuilding} from "../../dml/insert/insert_building.ts"
export class CreateBuilding extends BaseBuilding {
  
  private nameData: [string, string?] | null = null;
  private columnsData: Array<{ columnName: string, datatype: string, length?: number, nulleable?:boolean }> = [];
  private uniquesData: Array<{name?: string, columnNames: Array<string>}> = [];
  private valuesData: Array<any> = [];
  constructor(public conf : { delimiters: [string, string?]} = { delimiters: [`"`]}){
    super(conf);
  }

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
  
  uniques(... uniques: Array<{name?: string, columnNames: Array<string>}>): void {
    this.uniquesData = [];
    uniques.forEach(x => { 
      this.addUnique(x);
    });
  }

  addUnique(unique: {name?: string, columnNames: Array<string>}): void {
    this.uniquesData.push(unique);
  }

  data(data: Array<any> | any){
    this.addData(data);
  }

  addData(data: Array<any> | any){
    data = Array.isArray(data) ? data : [data];
    this.valuesData.push(... data);
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

  getInsertsQuery(){
    if(!this.nameData){
      return ``;
    }
    let ib = new InsertBuilding(this.conf);
    ib.insert(this.nameData);
    ib.values(this.valuesData);
    return ib.getQuery();
  }

  getQuery(){
    let query = `${this.getNameQuery()}\n${this.getColumnsQuery()}`;
    if(this.valuesData.length){
      query += `;\n${this.getInsertsQuery()}`;
    }
    return query;
  }
}