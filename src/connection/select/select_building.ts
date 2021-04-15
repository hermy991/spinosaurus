import {SelectOperations} from './select_operations.ts';
class SelectBuilding {
  constructor(
    private selectData: Array<[string, string?]> = [],
    private fromData: [string, string?] = [""]
    ){  }
  select(... columns: Array<[string, string?]>): void {
    this.selectData = [];
    columns.forEach(x => this.selectData.push(x) );
  }
  addSelect(column: string, as?: string): void {
    const currColumn: [string, string?] = [column]
    if(as){
      currColumn.push(as);
    }
    this.selectData.push(currColumn);
  }

  from(entity: string, as?: string): void {
    this.fromData = [entity, as];
  }

  getData(): Array<[string, string?]> {
    return this.selectData;
  }
  
  getSelectQuery(){
    if(!this.selectData.length){
      return `SELECT * `;
    }
    let query = "";
    for(let i = 0; i < this.selectData.length; i++){
      const [column, as] = this.selectData[i];
      query += `${column}` + (as ? ' AS ' + as: '');
      if(i + 1 !== this.selectData.length){
        query = ",\n"
      }
    }
    return `SELECT ${query} `;
  }
  
  getFromQuery(){
    if(!this.fromData){
      return ``;
    }
    let [from, as] = this.fromData;
    let query = `${from}${as ? ' AS ' + as: ''}`;
    return `FROM ${query} `;
  }

  getQuery(){
    let query = 
`
${this.getSelectQuery()}
${this.getFromQuery()}
`;
    return query;
  }
}
export {SelectBuilding}