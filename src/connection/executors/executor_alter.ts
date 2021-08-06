import { SpiColumnAdjust } from "./types/spi_column_adjust.ts";
import { SpiColumnDefinition } from "./types/spi_column_definition.ts";
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
    ...columns: Array<[string, SpiColumnAdjust] | SpiColumnDefinition>
  ): ExecutorAlter {
    this.ab.columns(...columns);
    return this;
  }

  addColumn(
    column: [string, SpiColumnAdjust] | SpiColumnDefinition,
  ): ExecutorAlter {
    this.ab.addColumn(column);
    return this;
  }

  // uniques(...uniques: Array<SpiUniqueDefinition>): ExecutorAlter {
  //   this.cb.uniques(...uniques);
  //   return this;
  // }

  // addUnique(unique: SpiUniqueDefinition): ExecutorAlter {
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

  getQuery(): string {
    const query = this.ab.getQuery();
    return query;
  }

  async execute(): Promise<any> {
    const query = this.getQuery();
    return await this.conn.execute(query);
  }
}
