import {interpolate, clearNames} from "../../tools/sql.ts";
import {SpiColumnDefinition} from "../../../connection/executors/types/spi_column_definition.ts";
import {SpiUniqueDefinition} from "../../../connection/executors/types/spi_unique_definition.ts";
import {BaseBuilding} from "../../base_building.ts";
import {InsertBuilding} from "../../dml/insert/insert_building.ts"
export class CreateBuilding extends BaseBuilding {
  
  private nameData: [string, string?] | null = null;
  private columnsData: Array<{ columnName: string, spitype: string, length?: number, nullable?:boolean }> = [];
  private uniquesData: Array<{name?: string, columnNames: Array<string>}> = [];
  private valuesData: Array<any> = [];
  constructor(public conf : { delimiters: [string, string?] } = { delimiters: [`"`]},
              public transformer: { columnDefinition?: Function } = {}
  ){
    super(conf);
  }

  create(req: {entity: string, schema?: string}): void {
    const {entity, schema} = req;
    this.nameData = [`${entity}`, schema];
  }

  columns(... columns: Array<SpiColumnDefinition>): void {
    this.columnsData = [];
    columns.forEach(x => { 
      this.addColumn(x);
    });
  }

  addColumn(column: SpiColumnDefinition): void {
    column.columnName = `${column.columnName}`;
    this.columnsData.push(column);
  }
  
  uniques(... uniques: Array<SpiUniqueDefinition>): void {
    this.uniquesData = [];
    uniques.forEach(x => { 
      this.addUnique(x);
    });
  }

  addUnique(unique: SpiUniqueDefinition): void {
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
    const [entity, schema] = this.nameData;
    let query = `${clearNames({left: this.left, identifiers: entity, right: this.right})}`;
    if(schema){
      query = `${clearNames({left: this.left, identifiers: [schema, entity], right: this.right})}`;
    }
    return `CREATE TABLE ${query}`;
  }
  
  getColumnsQuery(){
    if(!this.columnsData.length){
      return ``;
    }
    const sqls: string[] = [];
    for(let i = 0; i < this.columnsData.length; i++){
      let sql = "";
      let columnName = `${this.columnsData[i].columnName}`.replace(/["]/ig, "");
      columnName = `${clearNames({left: this.left, identifiers: columnName, right: this.right})}`;
      if(this.transformer!.columnDefinition){
        sql = this.transformer!.columnDefinition({...this.columnsData[i], columnName});
      }
      sqls.push(sql);
    }
    return `( ${sqls.join(", ")} )`;
  }

  getInsertsQuery(){
    if(!this.nameData){
      return ``;
    }
    const ib = new InsertBuilding(this.conf);
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