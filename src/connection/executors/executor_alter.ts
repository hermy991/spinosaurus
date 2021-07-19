import { SpiColumnDefinition } from "./types/spi_column_definition.ts";
// import { SpiUniqueDefinition } from "./types/spi_unique_definition.ts";
import { ConnectionPostgres } from "../postgres/connection_postgres.ts";
import { AlterBuilding } from "../../language/ddl/alter/alter_building.ts";

export class ExecutorAlter {
  ab: AlterBuilding = new AlterBuilding();
  constructor(public conn: ConnectionPostgres) {
    this.ab = new AlterBuilding(
      { delimiters: conn.delimiters },
      conn.transformer,
    );
  }

  alter(req: { entity: string; schema?: string }): ExecutorAlter {
    this.ab.alter(req);
    return this;
  }

  columns(
    ...columns: Array<[string, SpiColumnDefinition] | SpiColumnDefinition>
  ): ExecutorAlter {
    this.ab.columns(...columns);
    return this;
  }

  addColumn(
    column: [string, SpiColumnDefinition] | SpiColumnDefinition,
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
