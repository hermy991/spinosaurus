import { ParamColumnDefinition } from "../builders/params/param_column.ts";
import { ParamCheck } from "../builders/params/param_check.ts";
import { ParamUnique } from "../builders/params/param_unique.ts";
import { ParamRelationCreate } from "../builders/params/param_relation.ts";
import { ParamCreateData } from "../builders/params/param_create.ts";
import { ConnectionAll } from "../connection_type.ts";
import { BuilderCreate } from "../builders/builder_create.ts";

export class ExecutorCreate {
  cb: BuilderCreate = new BuilderCreate(<ConnectionAll> {});
  constructor(public conn: ConnectionAll) {
    this.cb = new BuilderCreate(conn);
  }

  create(
    req: { entity: string; schema?: string } | {
      schema: string;
      check?: boolean;
    } | Function,
  ): ExecutorCreate {
    this.cb.create(req);
    return this;
  }

  columns(
    ...columns: Array<ParamColumnDefinition>
  ): ExecutorCreate {
    this.cb.columns(...columns);
    return this;
  }

  addColumn(column: ParamColumnDefinition): ExecutorCreate {
    this.cb.addColumn(column);
    return this;
  }

  checks(...checks: Array<ParamCheck>): ExecutorCreate {
    this.cb.checks(...checks);
    return this;
  }

  addCheck(check: ParamCheck): ExecutorCreate {
    this.cb.addCheck(check);
    return this;
  }

  uniques(...uniques: Array<ParamUnique>): ExecutorCreate {
    this.cb.uniques(...uniques);
    return this;
  }

  addUnique(unique: ParamUnique): ExecutorCreate {
    this.cb.addUnique(unique);
    return this;
  }

  relations(...relations: Array<ParamRelationCreate>): ExecutorCreate {
    this.cb.relations(...relations);
    return this;
  }

  addRelation(relation: ParamRelationCreate): ExecutorCreate {
    this.cb.addRelation(relation);
    return this;
  }

  data(data: ParamCreateData[] | ParamCreateData): ExecutorCreate {
    this.cb.data(data);
    return this;
  }

  addData(data: ParamCreateData[] | ParamCreateData): ExecutorCreate {
    this.cb.addData(data);
    return this;
  }

  printSql(): ExecutorCreate {
    this.cb.printSql();
    return this;
  }

  getSql(): string {
    const query = this.cb.getSql();
    return query;
  }

  async execute(): Promise<any> {
    const query = this.getSql();
    this.cb.usePrintSql(query);
    return await this.conn.execute(query);
  }
}
