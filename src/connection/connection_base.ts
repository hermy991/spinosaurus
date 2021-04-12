import {SelectOperations} from '../select/select_operations.ts'

class ConnectionBase {

  constructor(
    protected selectData: Array<Array<string>> = [["*"]],
    protected fromPart: string = "",
    protected wherePart: string = "",
    protected groupByPart: string = "",
    protected havingPart: string = "",
    protected orderByPart: string = ""
    ){}

  public getQuery() {
    let query = "";
    query += `
${SelectOperations.getQuery(...this.selectData)}
FROM ${this.fromPart}
`;
    if(this.wherePart){
      query += `
WHERE ${this.wherePart}
`;
    }
    if(this.groupByPart){
      query += `
GROUP BY ${this.groupByPart}
`;
    }
    if(this.havingPart){
      query += `
HAVING ${this.havingPart}
`;
    }
    if(this.orderByPart){
      query += `
ORDER BY ${this.orderByPart}
`;
    }
    return query;
  }

  public getRaw(){
    
  }

  select(... columns: Array<string|Array<string>>) {
    for(let i = 0; i < columns.length; i++) {
      const tempValue = columns[i];
      if(typeof tempValue === "string"){
        this.addSelect(tempValue);
      }
      else if (Array.isArray(tempValue)){
        this.addSelect(tempValue.slice(0, 2));
      }
    }
  }

  addSelect(column: Array<string> | string, as?: string){
    if(Array.isArray(column)){
      this.selectData.push(column.slice(0, 2));
    }
    else if (typeof column === "string"){
      column = [column];
      if(as){
        column.push(as);
      }
      this.selectData.push(column);
    }
  }

}

export {ConnectionBase}