import { ParamColumnDefinition } from "../builders/params/param_column.ts";
import { ParamCheck } from "../builders/params/param_check.ts";
import { ParamUnique } from "../builders/params/param_unique.ts";
import { ParamRelationCreate } from "../builders/params/param_relation.ts";
import {
  ParamCreateAfter,
  ParamCreateData,
  ParamCreateEntity,
  ParamCreateNext,
} from "../builders/params/param_create.ts";
import { Driver } from "../connection_type.ts";
import { BuilderCreate } from "../builders/builder_create.ts";

export class ExecutorCreate {
  cb: BuilderCreate = new BuilderCreate(<Driver> {});
  constructor(public conn: Driver) {
    this.cb = new BuilderCreate(conn);
  }

  create(req: ParamCreateEntity): ExecutorCreate {
    this.cb.create(req);
    return this;
  }

  columns(columns: Array<ParamColumnDefinition>): ExecutorCreate {
    this.cb.columns(columns);
    return this;
  }

  addColumn(column: ParamColumnDefinition): ExecutorCreate {
    this.cb.addColumn(column);
    return this;
  }

  checks(checks: Array<ParamCheck>): ExecutorCreate {
    this.cb.checks(checks);
    return this;
  }

  addCheck(check: ParamCheck): ExecutorCreate {
    this.cb.addCheck(check);
    return this;
  }

  uniques(uniques: Array<ParamUnique>): ExecutorCreate {
    this.cb.uniques(uniques);
    return this;
  }

  addUnique(unique: ParamUnique): ExecutorCreate {
    this.cb.addUnique(unique);
    return this;
  }

  relations(relations: Array<ParamRelationCreate>): ExecutorCreate {
    this.cb.relations(relations);
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

  next(data: ParamCreateNext[] | ParamCreateNext): ExecutorCreate {
    this.cb.next(data);
    return this;
  }

  addNext(data: ParamCreateNext[] | ParamCreateNext): ExecutorCreate {
    this.cb.addNext(data);
    return this;
  }

  after(data: ParamCreateAfter[] | ParamCreateAfter): ExecutorCreate {
    this.cb.after(data);
    return this;
  }

  addAfter(data: ParamCreateAfter[] | ParamCreateAfter): ExecutorCreate {
    this.cb.addAfter(data);
    return this;
  }

  printSql(): ExecutorCreate {
    this.cb.printSql();
    return this;
  }

  getSqls(): string[] {
    const sqls = this.cb.getSqls();
    return sqls;
  }

  getSql(): string {
    const sqls = this.getSqls();
    return sqls.join(";\n");
  }

  async execute(): Promise<any> {
    const query = this.getSqls();
    this.cb.usePrintSql(query);
    return await this.conn.execute(query.join(";\n"));
  }
}
