export class RenameBuilding {
  
  private fromData: [string, string | undefined] | null = null;
  private toData: [string, string | undefined] | null = null;
  private columnsData: Array<[string, string]> = [];

  /*FLAGS*/

  constructor(){  }

  rename(from: {entity: string, schema?: string}, to: {entity: string, schema?: string}): void {
    this.fromData = [`${from.entity.replace(/["\n\t]+/ig, "").trim()}`, from.schema];
    this.toData = [`${to.entity.replace(/["\n\t]+/ig, "").trim()}`, to.schema || from.schema];
  }

  columns(columns: Array<[string, string]>): void {
    this.columnsData = [];
    this.columnsData = [];
    columns.forEach(x => { 
      this.addColumn(x);
    });
  }

  addColumn(column: [string, string]): void {
    this.columnsData.push(column);
  }

  getEntityQuery(): string {
    if(!this.fromData){
      return ``;
    }
    let [entity, schema] = this.fromData;
    let from = `"${entity}"`;
    if(schema){
      from = `"${schema}"."${entity}"`;
    }
    [entity, schema] = this.fromData;
    let to = `"${entity}"`;
    if(schema){
      to = `"${schema}"."${entity}"`;
    }
    return `ALTER TABLE ${from} RENAME TO ${to}`;
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
      query = `${this.getEntityQuery()}\n${this.getColumnsQuery()}`
    }
    else {
      query = `${this.getEntityQuery()}`;
    }
    return query;
  }
}