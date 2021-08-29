import {
  ParamColumnAjust,
  ParamColumnCreate,
} from "../builders/params/param_column.ts";
import { ParamRelationDefinition } from "../builders/params/param_relation.ts";
import { ConnectionAll } from "../connection_type.ts";
import { BuilderAlter } from "../builders/builder_alter.ts";

export class ExecutorAlter {
  ab: BuilderAlter = new BuilderAlter(<ConnectionAll> {});
  constructor(public conn: ConnectionAll) {
    this.ab = new BuilderAlter(conn);
  }

  alter(req: { entity: string; schema?: string }): ExecutorAlter {
    this.ab.alter(req);
    return this;
  }

  columns(
    ...columns: Array<[string, ParamColumnAjust] | ParamColumnCreate>
  ): ExecutorAlter {
    this.ab.columns(...columns);
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
    ...relations: Array<
      [string, ParamRelationDefinition] | ParamRelationDefinition
    >
  ): ExecutorAlter {
    this.ab.relations(...relations);
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

  getSql(): string {
    const query = this.ab.getSql();
    return query;
  }

  async execute(): Promise<any> {
    const query = this.getSql();
    this.ab.usePrintSql(query);
    return await this.conn.execute(query);
  }
}
