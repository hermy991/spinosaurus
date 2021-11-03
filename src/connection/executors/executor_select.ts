import { Driver } from "../connection_type.ts";
import { BuilderSelect } from "../builders/builder_select.ts";
import { ParamClauseRelation, ParamComplexValues } from "../builders/params/param_select.ts";

export class ExecutorSelect {
  sb: BuilderSelect = new BuilderSelect(<Driver> {});
  constructor(public driver: Driver, public transaction: any) {
    this.sb = new BuilderSelect(driver);
  }

  /** DML SQL Operation*/
  select(...columns: Array<{ column: string; as?: string } | [string, string?]>): ExecutorSelect {
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

  selectDistinct(...columns: Array<{ column: string; as?: string } | [string, string?]>): ExecutorSelect {
    this.sb.selectDistinct(...columns);
    return this;
  }

  addSelect(...columns: Array<{ column: string; as?: string } | [string, string?]>): ExecutorSelect {
    this.sb.addSelect(...columns);
    return this;
  }

  from(
    req: { entity: string; schema?: string; as?: string } | { entity: Function; as?: string } | Function,
  ): ExecutorSelect {
    this.sb.from(req);
    return this;
  }

  join(req: ParamClauseRelation, params?: ParamComplexValues): ExecutorSelect {
    this.sb.join(req, params);
    return this;
  }

  joinAndSelect(req: ParamClauseRelation, params?: ParamComplexValues): ExecutorSelect {
    this.sb.joinAndSelect(req, params);
    return this;
  }

  left(req: ParamClauseRelation, params?: ParamComplexValues): ExecutorSelect {
    this.sb.left(req, params);
    return this;
  }

  leftAndSelect(req: ParamClauseRelation, params?: ParamComplexValues): ExecutorSelect {
    this.sb.leftAndSelect(req, params);
    return this;
  }

  right(req: ParamClauseRelation, params?: ParamComplexValues): ExecutorSelect {
    this.sb.right(req, params);
    return this;
  }

  rightAndSelect(req: ParamClauseRelation, params?: ParamComplexValues): ExecutorSelect {
    this.sb.rightAndSelect(req, params);
    return this;
  }

  where(conditions: [string, ...string[]] | string, params?: ParamComplexValues): ExecutorSelect {
    this.sb.where(conditions, params);
    return this;
  }

  andWhere(conditions: [string, ...string[]] | string, params?: ParamComplexValues): ExecutorSelect {
    this.sb.andWhere(conditions, params);
    return this;
  }

  orWhere(conditions: [string, ...string[]] | string, params?: ParamComplexValues): ExecutorSelect {
    this.sb.orWhere(conditions, params);
    return this;
  }

  addWhere(conditions: [string, ...string[]] | string, params?: ParamComplexValues): ExecutorSelect {
    this.sb.addWhere(conditions, params);
    return this;
  }

  groupBy(columns: [string, ...string[]] | string): ExecutorSelect {
    this.sb.groupBy(columns);
    return this;
  }

  addGroupBy(columns: [string, ...string[]] | string): ExecutorSelect {
    this.sb.addGroupBy(columns);
    return this;
  }

  having(conditions: [string, ...string[]] | string, params?: ParamComplexValues): ExecutorSelect {
    this.sb.having(conditions, params);
    return this;
  }

  andHaving(conditions: [string, ...string[]] | string, params?: ParamComplexValues): ExecutorSelect {
    this.sb.andHaving(conditions, params);
    return this;
  }

  orHaving(conditions: [string, ...string[]] | string, params?: ParamComplexValues): ExecutorSelect {
    this.sb.orHaving(conditions, params);
    return this;
  }

  addHaving(conditions: [string, ...string[]] | string, params?: ParamComplexValues): ExecutorSelect {
    this.sb.addHaving(conditions, params);
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
      | { column: string; direction?: "ASC" | "DESC" }
      | [string, ("ASC" | "DESC")?]
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

  params(options?: ParamComplexValues): ExecutorSelect {
    this.sb.params(options);
    return this;
  }

  addParams(options: ParamComplexValues): ExecutorSelect {
    this.sb.addParams(options);
    return this;
  }

  printSql(): ExecutorSelect {
    this.sb.printSql();
    return this;
  }

  getSqls(): string[] {
    const sqls = this.sb.getSqls();
    return sqls;
  }

  getSql(): string {
    const sqls = this.getSqls();
    return sqls.join(";\n");
  }

  async getOne(changes?: any): Promise<any> {
    const query = this.getSqls();
    this.sb.usePrintSql(query);
    const options: Record<string, any> = { changes, transaction: this.transaction };
    const data = await this.driver.getOne(query.join(";\n"), options);
    return data;
  }

  async getMany(changes?: any): Promise<Array<any>> {
    const query = this.getSqls();
    this.sb.usePrintSql(query);
    const options: Record<string, any> = { changes, transaction: this.transaction };
    const data = await this.driver.getMany(query.join(";\n"), options);
    return data;
  }

  getMultiple(): Promise<Array<any>> {
    throw "No implemented";
  }
}
