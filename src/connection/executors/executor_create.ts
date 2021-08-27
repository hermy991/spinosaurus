import { SpiAllColumnDefinition } from "./types/spi_all_column_definition.ts";
import { SpiCheckDefinition } from "./types/spi_check_definition.ts";
import { SpiUniqueDefinition } from "./types/spi_unique_definition.ts";
import { SpiRelationDefinition } from "./types/spi_relation_definition.ts";
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

  checks(...checks: Array<SpiCheckDefinition>): ExecutorCreate {
    this.cb.checks(...checks);
    return this;
  }

  addCheck(check: SpiCheckDefinition): ExecutorCreate {
    this.cb.addCheck(check);
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

  relations(...relations: Array<SpiRelationDefinition>): ExecutorCreate {
    this.cb.relations(...relations);
    return this;
  }

  addRelation(relation: SpiRelationDefinition): ExecutorCreate {
    this.cb.addRelation(relation);
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
