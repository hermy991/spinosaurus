import * as path from "deno/path/mod.ts";
import { Logging } from "../loggings/logging.ts";
import { ParamColumnAjust, ParamColumnCreate } from "../builders/params/param_column.ts";
import { ParamRelationDefinition } from "../builders/params/param_relation.ts";
import { Driver } from "../connection_type.ts";
import { BuilderAlter } from "../builders/builder_alter.ts";

export class ExecutorAlter {
  ab: BuilderAlter = new BuilderAlter(<Driver> {});
  constructor(public conn: Driver, public logging?: Logging) {
    this.ab = new BuilderAlter(conn, logging);
  }

  alter(req: { entity: string; schema?: string }): ExecutorAlter {
    this.ab.alter(req);
    return this;
  }

  columns(
    columns: ([string, ParamColumnAjust] | ParamColumnCreate)[],
  ): ExecutorAlter {
    this.ab.columns(columns);
    return this;
  }

  addColumns(
    columns: ([string, ParamColumnAjust] | ParamColumnCreate)[],
  ): ExecutorAlter {
    this.ab.addColumns(columns);
    return this;
  }

  addColumn(
    column: [string, ParamColumnAjust] | ParamColumnCreate,
  ): ExecutorAlter {
    this.ab.addColumn(column);
    return this;
  }

  // uniques(...uniques: Array<ParamUnique>): ExecutorAlter {
  //   this.cb.uniques(...uniques);
  //   return this;
  // }

  // addUnique(unique: ParamUnique): ExecutorAlter {
  //   this.cb.addUnique(unique);
  //   return this;
  // }

  // data(data: Array<any> | any): ExecutorCreate {
  //   this.cb.data(data);
  //   return this;
  // }

  // addData(data: Array<any> | any): ExecutorCreate {
  //   this.cb.addColumn(data);
  //   return this;
  // }

  relations(
    relations: ([string, ParamRelationDefinition] | ParamRelationDefinition)[],
  ): ExecutorAlter {
    this.ab.relations(relations);
    return this;
  }

  addRelations(
    relation: ([string, ParamRelationDefinition] | ParamRelationDefinition)[],
  ): ExecutorAlter {
    this.ab.addRelations(relation);
    return this;
  }

  addRelation(
    relation: [string, ParamRelationDefinition] | ParamRelationDefinition,
  ): ExecutorAlter {
    this.ab.addRelation(relation);
    return this;
  }

  printSql(): ExecutorAlter {
    this.ab.printSql();
    return this;
  }

  getSqls(): string[] {
    const sqls = this.ab.getSqls();
    return sqls;
  }

  getSql(): string {
    const sqls = this.getSqls();
    return sqls.join(";\n");
  }

  async execute(): Promise<any> {
    const query = this.getSqls();
    this.ab.usePrintSql(query);
    if (this.logging) {
      await this.logging.write({
        logginKey: `schema`,
        file: path.fromFileUrl(import.meta.url),
        className: this.constructor.name,
        functionName: `execute`,
        outLine: query.join(";").replace(/\n\r/ig, " "),
      });
    }
    return await this.conn.execute(query.join(`;\n`));
  }
}
