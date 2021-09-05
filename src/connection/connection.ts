import { ConnectionAll } from "./connection_type.ts";
import { ConnectionOptions } from "./connection_options.ts";
import { ConnectionPostgres } from "./drivers/postgres/connection_postgres.ts";
import { ParamCreateEntity } from "./builders/params/param_create.ts";
import { ParamUpdateEntity } from "./builders/params/param_update.ts";
import { ParamInsertEntity } from "./builders/params/param_insert.ts";
import { ParamUpsertEntity } from "./builders/params/param_upsert.ts";

import { error } from "../error/error_utills.ts";
import { ExecutorDrop } from "./executors/executor_drop.ts";
import { ExecutorCreate } from "./executors/executor_create.ts";
import { ExecutorAlter } from "./executors/executor_alter.ts";
import { ExecutorSelect } from "./executors/executor_select.ts";
import { ExecutorRename } from "./executors/executor_rename.ts";
import { ExecutorInsert } from "./executors/executor_insert.ts";
import { ExecutorUpdate } from "./executors/executor_update.ts";
import { ExecutorDelete } from "./executors/executor_delete.ts";
import { ExecutorUpsert } from "./executors/executor_upsert.ts";
import { ExecuteResult } from "./execute_result.ts";

class Connection {
  #connection?: ConnectionAll;

  constructor(options?: ConnectionOptions) {
    // if (!options) {
    //   options = "";
    // }
    if (options && options.type === "postgres") {
      this.#connection = new ConnectionPostgres(options);
    }
  }

  getConnectionOptions() {
    if (this.#connection) {
      return this.#connection.options;
    }
  }

  getConnection(): ConnectionAll {
    if (!this.#connection) throw error({ name: "ErrorConnectionNull" });
    return this.#connection;
  }

  async test(): Promise<boolean> {
    if (!this.#connection) throw error({ name: "ErrorConnectionNull" });
    const res = await this.#connection.test();
    return res;
  }

  async checkSchema(req: { name: string }) {
    if (!this.#connection) throw error({ name: "ErrorConnectionNull" });
    const res = await this.#connection.checkSchema(req);
    return res;
  }

  async checkObject(
    req: { name: string; schema?: string; database?: string },
  ): Promise<
    {
      name: string;
      schema?: string;
      database?: string;
      exists: boolean;
      oid?: number;
      dbdata?: any;
      type?: string;
    }
  > {
    if (!this.#connection) throw error({ name: "ErrorConnectionNull" });
    const res = await this.#connection.checkObject(req);
    return res;
  }

  async getCurrentDatabase() {
    if (!this.#connection) throw error({ name: "ErrorConnectionNull" });
    const res = await this.#connection.getCurrentDatabase();
    return res;
  }

  async getCurrentSchema() {
    if (!this.#connection) throw error({ name: "ErrorConnectionNull" });
    const res = await this.#connection.getCurrentSchema();
    return res;
  }

  create(req: ParamCreateEntity) {
    if (!this.#connection) throw error({ name: "ErrorConnectionNull" });
    const executor = new ExecutorCreate(this.#connection);
    executor.create(req);
    return executor;
  }

  alter(req: { entity: string; schema?: string }) {
    if (!this.#connection) throw error({ name: "ErrorConnectionNull" });
    const executor = new ExecutorAlter(this.#connection);
    executor.alter(req);
    return executor;
  }

  drop(
    req: { entity: string; schema?: string } | {
      schema: string;
      check?: boolean;
    },
  ) {
    if (!this.#connection) throw error({ name: "ErrorConnectionNull" });
    const executor: ExecutorDrop = new ExecutorDrop(this.#connection);
    executor.drop(req);
    return executor;
  }

  rename(
    from: { entity: string; schema?: string },
    to?: { entity: string; schema?: string },
  ) {
    if (!this.#connection) throw error({ name: "ErrorConnectionNull" });
    const executor: ExecutorRename = new ExecutorRename(this.#connection);
    executor.rename(from, to);
    return executor;
  }

  select(
    ...columns: Array<{ column: string; as?: string } | [string, string?]>
  ) {
    if (!this.#connection) throw error({ name: "ErrorConnectionNull" });
    const executor: ExecutorSelect = new ExecutorSelect(this.#connection);
    executor.select(...columns);
    return executor;
  }

  selectDistinct(
    ...columns: Array<{ column: string; as?: string } | [string, string?]>
  ) {
    if (!this.#connection) throw error({ name: "ErrorConnectionNull" });
    const executor: ExecutorSelect = new ExecutorSelect(this.#connection);
    executor.selectDistinct(...columns);
    return executor;
  }

  update(req: ParamUpdateEntity) {
    if (!this.#connection) throw error({ name: "ErrorConnectionNull" });
    const executor: ExecutorUpdate = new ExecutorUpdate(this.#connection);
    executor.update(req);
    return executor;
  }

  insert(req: ParamInsertEntity) {
    if (!this.#connection) throw error({ name: "ErrorConnectionNull" });
    const executor: ExecutorInsert = new ExecutorInsert(this.#connection);
    executor.insert(req);
    return executor;
  }

  delete(
    req: { entity: string; schema?: string } | [string, string?] | Function,
  ) {
    if (!this.#connection) throw error({ name: "ErrorConnectionNull" });
    const executor: ExecutorDelete = new ExecutorDelete(this.#connection);
    executor.delete(req);
    return executor;
  }

  upsert(req: ParamUpsertEntity) {
    if (!this.#connection) throw error({ name: "ErrorConnectionNull" });
    const executor: ExecutorUpsert = new ExecutorUpsert(this.#connection);
    executor.upsert(req);
    return executor;
  }

  async execute(query: string, changes?: any): Promise<ExecuteResult> {
    if (!this.#connection) throw error({ name: "ErrorConnectionNull" });
    const data = await this.#connection.execute(query, changes);
    return data;
  }
}

export { Connection };
