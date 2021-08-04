import { ConnectionPostgres } from "../postgres/connection_postgres.ts";
import { SelectBuilding } from "../../language/dml/select/select_building.ts";

export class ExecutorSelect {
  sb: SelectBuilding = new SelectBuilding();
  constructor(public conn: ConnectionPostgres) {
    this.sb = new SelectBuilding(
      { delimiters: conn.delimiters },
      conn.transformer,
    );
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
    req: { entity: string; schema?: string; as?: string } | {
      entity: Function;
      as?: string;
    },
  ): ExecutorSelect {
    const treq = req;

    this.sb.from(treq);
    return this;
  }
  where(
    conditions: Array<string>,
    params?: { [x: string]: string | number | Date },
  ): ExecutorSelect {
    this.sb.where(conditions, params);
    return this;
  }
  addWhere(
    conditions: Array<string>,
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
  getQuery(): string {
    const query = this.sb.getQuery();
    return query;
  }
  async getOne(): Promise<any> {
    const query = this.getQuery();
    const data = this.conn.getOne(query);
    return data;
  }
  async getRawOne(): Promise<Array<any>> {
    const query = this.getQuery();
    const data = this.conn.getRawOne(query);
    return data;
  }
  async getMany(): Promise<Array<any>> {
    const query = this.getQuery();
    const data = this.conn.getMany(query);
    return data;
  }
  async getRawMany(): Promise<Array<any>> {
    const query = this.getQuery();
    const data = await this.conn.getRawMany(query);
    return data;
  }
  async getRawMultiple(): Promise<Array<any>> {
    const query = this.getQuery();
    const data = this.conn.getRawMultiple(query);
    return data;
  }
}
