import { ConnectionAll } from "./connection_type.ts";
import { ConnectionOptions } from "./connection_options.ts";
import { transferTemp } from "../stores/store.ts";
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
  #driver?: ConnectionAll;

  constructor(options?: ConnectionOptions) {
    if (options && options.type === "postgres") {
      this.#driver = new ConnectionPostgres(options);
      transferTemp(this.getDriver().options.name);
    }
  }

  getConnectionOptions() {
    if (this.#driver) {
      return this.#driver.options;
    }
  }

  getDriver(): ConnectionAll {
    if (!this.#driver) throw error({ name: "ErrorConnectionNull" });
    return this.#driver;
  }

  async test(): Promise<boolean> {
    if (!this.#driver) throw error({ name: "ErrorConnectionNull" });
    const res = await this.#driver.test();
    return res;
  }

  async checkSchema(req: { name: string }) {
    if (!this.#driver) throw error({ name: "ErrorConnectionNull" });
    const res = await this.#driver.checkSchema(req);
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
    if (!this.#driver) throw error({ name: "ErrorConnectionNull" });
    const res = await this.#driver.checkObject(req);
    return res;
  }

  async getCurrentDatabase() {
    if (!this.#driver) throw error({ name: "ErrorConnectionNull" });
    const res = await this.#driver.getCurrentDatabase();
    return res;
  }

  async getCurrentSchema() {
    if (!this.#driver) throw error({ name: "ErrorConnectionNull" });
    const res = await this.#driver.getCurrentSchema();
    return res;
  }

  create(req: ParamCreateEntity) {
    if (!this.#driver) throw error({ name: "ErrorConnectionNull" });
    const executor = new ExecutorCreate(this.#driver);
    executor.create(req);
    return executor;
  }

  alter(req: { entity: string; schema?: string }) {
    if (!this.#driver) throw error({ name: "ErrorConnectionNull" });
    const executor = new ExecutorAlter(this.#driver);
    executor.alter(req);
    return executor;
  }

  drop(
    req: { entity: string; schema?: string } | {
      schema: string;
      check?: boolean;
    },
  ) {
    if (!this.#driver) throw error({ name: "ErrorConnectionNull" });
    const executor: ExecutorDrop = new ExecutorDrop(this.#driver);
    executor.drop(req);
    return executor;
  }

  rename(
    from: { entity: string; schema?: string },
    to?: { entity: string; schema?: string },
  ) {
    if (!this.#driver) throw error({ name: "ErrorConnectionNull" });
    const executor: ExecutorRename = new ExecutorRename(this.#driver);
    executor.rename(from, to);
    return executor;
  }

  select(
    ...columns: Array<{ column: string; as?: string } | [string, string?]>
  ) {
    if (!this.#driver) throw error({ name: "ErrorConnectionNull" });
    const executor: ExecutorSelect = new ExecutorSelect(this.#driver);
    executor.select(...columns);
    return executor;
  }

  selectDistinct(
    ...columns: Array<{ column: string; as?: string } | [string, string?]>
  ) {
    if (!this.#driver) throw error({ name: "ErrorConnectionNull" });
    const executor: ExecutorSelect = new ExecutorSelect(this.#driver);
    executor.selectDistinct(...columns);
    return executor;
  }

  update(req: ParamUpdateEntity) {
    if (!this.#driver) throw error({ name: "ErrorConnectionNull" });
    const executor: ExecutorUpdate = new ExecutorUpdate(this.#driver);
    executor.update(req);
    return executor;
  }

  insert(req: ParamInsertEntity) {
    if (!this.#driver) throw error({ name: "ErrorConnectionNull" });
    const executor: ExecutorInsert = new ExecutorInsert(this.#driver);
    executor.insert(req);
    return executor;
  }

  delete(
    req: { entity: string; schema?: string } | [string, string?] | Function,
  ) {
    if (!this.#driver) throw error({ name: "ErrorConnectionNull" });
    const executor: ExecutorDelete = new ExecutorDelete(this.#driver);
    executor.delete(req);
    return executor;
  }

  upsert(req: ParamUpsertEntity) {
    if (!this.#driver) throw error({ name: "ErrorConnectionNull" });
    const executor: ExecutorUpsert = new ExecutorUpsert(this.#driver);
    executor.upsert(req);
    return executor;
  }

  async transaction(f: any): Promise<any | undefined> {
    let err = undefined;
    try {
      await f();
    } catch (ex) {
      return err;
    }
  }

  async execute(query: string, changes?: any): Promise<ExecuteResult> {
    if (!this.#driver) throw error({ name: "ErrorConnectionNull" });
    const data = await this.#driver.execute(query, changes);
    return data;
  }
}

export { Connection };
