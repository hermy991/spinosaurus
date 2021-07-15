import { SpiColumnDefinition } from "./types/spi_column_definition.ts";
import { SpiUniqueDefinition } from "./types/spi_unique_definition.ts";
import { ConnectionPostgres } from "../postgres/connection_postgres.ts";
import { CreateBuilding } from "../../language/ddl/create/create_building.ts";

export class ExecutorCreate {
  cb: CreateBuilding = new CreateBuilding();
  constructor(public conn: ConnectionPostgres) {
    this.cb = new CreateBuilding(
      { delimiters: conn.delimiters },
      conn.transformer,
    );
  }

  create(
    req: { entity: string; schema?: string } | { schema: string },
  ): ExecutorCreate {
    this.cb.create(req);
    return this;
  }

  columns(...columns: Array<SpiColumnDefinition>): ExecutorCreate {
    this.cb.columns(...columns);
    return this;
  }

  addColumn(req: SpiColumnDefinition): ExecutorCreate {
    this.cb.addColumn(req);
    return this;
  }

  uniques(...uniques: Array<SpiUniqueDefinition>): ExecutorCreate {
    this.cb.uniques(...uniques);
    return this;
  }

  addUnique(unique: SpiUniqueDefinition): ExecutorCreate {
    this.cb.addUnique(unique);
    return this;
  }

  data(data: Array<any> | any): ExecutorCreate {
    this.cb.data(data);
    return this;
  }

  addData(data: Array<any> | any): ExecutorCreate {
    this.cb.addColumn(data);
    return this;
  }

  getQuery(): string {
    const query = this.cb.getQuery();
    return query;
  }

  async execute(): Promise<any> {
    const query = this.getQuery();
    return await this.conn.execute(query);
  }
}
