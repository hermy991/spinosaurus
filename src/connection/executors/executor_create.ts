import { SpiAllColumnDefinition } from "./types/spi_all_column_definition.ts";
import { SpiUniqueDefinition } from "./types/spi_unique_definition.ts";
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
    },
  ): ExecutorCreate {
    this.cb.create(req);
    return this;
  }

  columns(
    ...columns: Array<SpiAllColumnDefinition>
  ): ExecutorCreate {
    this.cb.columns(...columns);
    return this;
  }

  addColumn(
    column: SpiAllColumnDefinition,
  ): ExecutorCreate {
    this.cb.addColumn(column);
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
