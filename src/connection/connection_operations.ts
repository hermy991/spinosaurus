import {SelectOperations} from '../select/select_operations.ts'

class ConnectionOperations {

  constructor(
    protected selectData: Array<Array<string>> = [["*"]],
    protected fromPart: string = "",
    protected wherePart: string = "",
    protected groupByPart: string = "",
    protected havingPart: string = "",
    protected orderByPart: string = ""
    ){}

  public getQuery(): string {
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

  public select(... columns: Array<string|Array<string>>) {
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

  public addSelect(column: Array<string> | string, as?: string){
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

  public from(entity: string, as: string, ons: Array<string> | string){
    
  }

}

export {ConnectionOperations}