export class Query {
  constructor(
    public args: any[],
    public fields: any[],
    public text: string,
  ) {}
}

export enum Format {
  TEXT = 0,
  BINARY = 1,
}

export class Column {
  constructor(
    public name: string,
    public tableOid: number,
    public index: number,
    public typeOid: number,
    public columnLength: number,
    public typeModifier: number,
    public format: Format,
  ) {}
}

export class ExecuteResult {
  /**
   *
   query: Query {
      args: [],
      fields: undefined,
      result_type: 1,
      text: 'SELECT current_schema() "current_schema"'
    },
    _done: true,
    command: "SELECT",
    rowCount: 1,
    rowDescription: RowDescription { columnCount: 1, columns: [ [Object] ] },
    warnings: [],
    rows: [ { current_schema: "public" } ]
  }
   */

  // rowCount = 0;
  // rowDescription: columnCount: number, public columns: Column[]) = {
  //   columnCount: 0,
  //   column,
  // };
  // rows: any[] = [];
  constructor(
    public query: Query,
    public rowCount?: number,
    public rowDescription?: { columnCount: number; columns: Column[] },
    public rows?: any[],
  ) {}
}
