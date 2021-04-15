import {SelectOperations} from './select_operations.ts';
class SelectBuilding {
  constructor(
    private selectData: Array<Array<string>> = []
    ){  }
  select(... columns: Array<Array<string>>): void {
    this.selectData = [];
    columns.forEach(x => this.selectData.push([... (x.slice(0, 2))]) );
  }
  addSelect(column: string, as?: string){
    this.selectData.push([column]);
  }
  getQuery(): string {
    let query = "";
    return query;
  }
}
export {SelectBuilding}