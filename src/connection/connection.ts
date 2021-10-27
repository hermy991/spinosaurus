import { Driver } from "./connection_type.ts";
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
  #transactions: Record<string, any> = {};
  #driver?: Driver;

  constructor(options?: ConnectionOptions) {
    if (options && options.type === "postgres") {
      this.#driver = new ConnectionPostgres(options);
      transferTemp(this.getDriver().options.name);
    }
  }

  getTransactions(): Record<string, any> {
    return this.#transactions;
  }

  getTransaction(): any | undefined {
    const transactionsCount = Object.entries(this.getTransactions()).length;
    if (transactionsCount) {
      return Object.entries(this.getTransactions())[transactionsCount - 1][1].transaction;
    }
  }

  getConnectionOptions() {
    if (this.#driver) {
      return this.#driver.options;
    }
  }

  getDriver(): Driver {
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
    const executor: ExecutorSelect = new ExecutorSelect(this.#driver, this.getTransaction());
    executor.select(...columns);
    return executor;
  }

  selectDistinct(
    ...columns: Array<{ column: string; as?: string } | [string, string?]>
  ) {
    if (!this.#driver) throw error({ name: "ErrorConnectionNull" });
    const executor: ExecutorSelect = new ExecutorSelect(this.#driver, this.getTransaction());
    executor.selectDistinct(...columns);
    return executor;
  }

  update(req: ParamUpdateEntity) {
    if (!this.#driver) throw error({ name: "ErrorConnectionNull" });
    const executor: ExecutorUpdate = new ExecutorUpdate(this.#driver, this.getTransaction());
    executor.update(req);
    return executor;
  }

  insert(req: ParamInsertEntity) {
    if (!this.#driver) throw error({ name: "ErrorConnectionNull" });
    const executor: ExecutorInsert = new ExecutorInsert(this.#driver, this.getTransaction());
    executor.insert(req);
    return executor;
  }

  delete(
    req: { entity: string; schema?: string } | [string, string?] | Function,
  ) {
    if (!this.#driver) throw error({ name: "ErrorConnectionNull" });
    const executor: ExecutorDelete = new ExecutorDelete(this.#driver, this.getTransaction());
    executor.delete(req);
    return executor;
  }

  upsert(req: ParamUpsertEntity) {
    if (!this.#driver) throw error({ name: "ErrorConnectionNull" });
    const executor: ExecutorUpsert = new ExecutorUpsert(this.#driver, this.getTransaction());
    executor.upsert(req);
    return executor;
  }

  /**
   * Wraps given function execution (and all operations made there) in a transaction.
   */
  async transaction<T>(fun: () => Promise<T>): Promise<T>;

  /**
   * Wraps given function execution (and all operations made there) in a transaction.
   * using a transaction name
   */
  async transaction<T>(transactionName: string, fun: () => Promise<T>): Promise<T>;

  /**
   * Wraps given function execution (and all operations made there) in a transaction.
   */
  async transaction<T>(
    transactionNameOrFun: string | (() => Promise<T>),
    fun?: (() => Promise<T>),
  ): Promise<any | undefined> {
    let transactionName = transactionNameOrFun instanceof Function
      ? `transaction_${Object.keys(this.#transactions).length + 1}`
      : transactionNameOrFun;
    let f = transactionNameOrFun instanceof Function ? transactionNameOrFun : fun;
    if (!f) return error({ name: "ErrorParamIsRequired" });
    if (!this.#driver) return error({ name: "ErrorConnectionNull" });
    let err = undefined;
    let r;
    try {
      console.log("inside a transaction function");
      r = await this.#driver.createTransaction({ transactionName });
      if (!r?.transaction) return error({ name: "ErrorTransactionNull" });
      this.getTransactions()[transactionName] = r;
      await r.transaction.begin();
      await f();
      console.log("inside a transaction before commit");
      await r.transaction.commit();
      await r.client.end();
      delete this.getTransactions()[transactionName];
    } catch (ex) {
      console.log("inside a transaction function catch 1");
      if (r?.transaction) {
        delete this.getTransactions()[transactionName];
        console.log("inside a transaction function catch 2");
        await r.transaction.rollback();
        await r.client.end();
      }
      return err;
    }
  }

  async execute(query: string, changes?: any): Promise<ExecuteResult> {
    console.log("Object.values(this.getTransactions()).length", Object.values(this.getTransactions()).length);
    if (!this.#driver) throw error({ name: "ErrorConnectionNull" });
    const options: Record<string, any> = { changes };
    console.log("inside a execute function");
    if (this.getTransaction()) {
      options.transaction = this.getTransaction();
      console.log("options.transaction", options.transaction);
    }
    const data = await this.#driver.execute(query, options);
    return data;
  }
}

export { Connection };
