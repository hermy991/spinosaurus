import { ConnectionAll } from "../connection_type.ts";
import { BuilderSelect } from "../builders/builder_select.ts";

export class ExecutorSelect {
  sb: BuilderSelect = new BuilderSelect(<ConnectionAll> {});
  constructor(public conn: ConnectionAll) {
    this.sb = new BuilderSelect(conn);
  }

  /** DML SQL Operation*/
  select(
    ...columns: Array<{ column: string; as?: string } | [string, string?]>
  ): ExecutorSelect {
    const tempColumns: Array<{ column: string; as?: string }> = [];
    for (let i = 0; i < columns.length; i++) {
      if (Array.isArray(columns[i])) {
        const [column, as] = (columns[i] as [string, string?]);
        tempColumns.push({ column, as });
      } else {
        tempColumns.push(columns[i] as { column: string; as?: string });
      }
    }
    this.sb.select(...tempColumns);
    return this;
  }

  selectDistinct(
    ...columns: Array<{ column: string; as?: string } | [string, string?]>
  ): ExecutorSelect {
    const tempColumns: Array<{ column: string; as?: string }> = [];
    for (let i = 0; i < columns.length; i++) {
      if (Array.isArray(columns[i])) {
        const [column, as] = (columns[i] as [string, string?]);
        tempColumns.push({ column, as });
      } else {
        tempColumns.push(columns[i] as { column: string; as?: string });
      }
    }
    this.sb.selectDistinct(...tempColumns);
    return this;
  }

  addSelect(req: { column: string; as?: string }): ExecutorSelect {
    this.sb.addSelect(req);
    return this;
  }

  from(
    req:
      | { entity: string; schema?: string; as?: string }
      | { entity: Function; as?: string }
      | Function,
  ): ExecutorSelect {
    this.sb.from(req);
    return this;
  }

  join(
    req: {
      entity: string;
      schema?: string;
      as?: string;
      on: string | string[];
    } | {
      entity: Function;
      as?: string;
      on: string | string[];
    },
  ): ExecutorSelect {
    this.sb.join(req);
    return this;
  }

  joinAndSelect(
    req: {
      entity: string;
      schema?: string;
      as?: string;
      on: string | string[];
    } | {
      entity: Function;
      as?: string;
      on: string | string[];
    },
  ): ExecutorSelect {
    this.sb.joinAndSelect(req);
    return this;
  }

  left(
    req: {
      entity: string;
      schema?: string;
      as?: string;
      on: string | string[];
    } | {
      entity: Function;
      as?: string;
      on: string | string[];
    },
  ): ExecutorSelect {
    this.sb.left(req);
    return this;
  }

  leftAndSelect(
    req: {
      entity: string;
      schema?: string;
      as?: string;
      on: string | string[];
    } | {
      entity: Function;
      as?: string;
      on: string | string[];
    },
  ): ExecutorSelect {
    this.sb.leftAndSelect(req);
    return this;
  }

  right(
    req: {
      entity: string;
      schema?: string;
      as?: string;
      on: string | string[];
    } | {
      entity: Function;
      as?: string;
      on: string | string[];
    },
  ): ExecutorSelect {
    this.sb.right(req);
    return this;
  }

  rightAndSelect(
    req: {
      entity: string;
      schema?: string;
      as?: string;
      on: string | string[];
    } | {
      entity: Function;
      as?: string;
      on: string | string[];
    },
  ): ExecutorSelect {
    this.sb.rightAndSelect(req);
    return this;
  }

  where(
    conditions: [string, ...string[]],
    params?: { [x: string]: string | number | Date },
  ): ExecutorSelect {
    this.sb.where(conditions, params);
    return this;
  }

  addWhere(
    conditions: [string, ...string[]],
    params?: { [x: string]: string | number | Date },
  ): ExecutorSelect {
    this.sb.addWhere(conditions, params);
    return this;
  }

  orderBy(
    ...columns: Array<
      { column: string; direction?: "ASC" | "DESC" } | [
        string,
        ("ASC" | "DESC")?,
      ]
    >
  ): ExecutorSelect {
    const tempColumns: Array<{ column: string; direction?: string }> = [];
    for (let i = 0; i < columns.length; i++) {
      if (Array.isArray(columns[i])) {
        const [column, direction] = (columns[i] as [string, string?]);
        tempColumns.push({ column, direction });
      } else {
        tempColumns.push(columns[i] as { column: string; direction?: string });
      }
    }
    this.sb.orderBy(...tempColumns);
    return this;
  }

  addOrderBy(
    ...columns: Array<
      { column: string; direction?: "ASC" | "DESC" } | [
        string,
        ("ASC" | "DESC")?,
      ]
    >
  ): ExecutorSelect {
    const tempColumns: Array<{ column: string; direction?: string }> = [];
    for (let i = 0; i < columns.length; i++) {
      if (Array.isArray(columns[i])) {
        const [column, direction] = (columns[i] as [string, string?]);
        tempColumns.push({ column, direction });
      } else {
        tempColumns.push(columns[i] as { column: string; direction?: string });
      }
    }
    this.sb.addOrderBy(...tempColumns);
    return this;
  }

  printSql(): ExecutorSelect {
    this.sb.printSql();
    return this;
  }

  getSql(): string {
    const query = this.sb.getSql();
    return query;
  }

  async getOne(): Promise<any> {
    const query = this.getSql();
    this.sb.usePrintSql(query);
    const data = await this.conn.getOne(query);
    return data;
  }

  async getMany(): Promise<Array<any>> {
    const query = this.getSql();
    this.sb.usePrintSql(query);
    const data = await this.conn.getMany(query);
    return data;
  }

  getMultiple(): Promise<Array<any>> {
    throw "No implemented";
  }
}
