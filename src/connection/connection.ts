import * as path from "deno/path/mod.ts";
import { Driver } from "./connection_type.ts";
import { createLogging, Logging } from "./loggings/logging.ts";
import { ConnectionOptions } from "./connection_options.ts";
import { transferTemp } from "../stores/store.ts";
import { DriverPostgres } from "./drivers/postgres/driver_postgres.ts";
import { ParamCreateEntity } from "./builders/params/param_create.ts";
import { ParamFromOptions } from "./builders/params/param_select.ts";
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
  #logging?: Logging;

  constructor(options?: ConnectionOptions) {
    if (options && options.type === "postgres") {
      this.#driver = new DriverPostgres(options);
      transferTemp(this.getDriver().options.name);
    }
    if (options && options.logging) {
      this.#logging = createLogging(options.logging);
    }
  }

  getLogging(): Logging | undefined {
    return this.#logging;
  }

  getTransactions(): Record<string, any> {
    return this.#transactions;
  }

  getTransaction(): any | undefined {
    const transactionsCount = Object.entries(this.getTransactions()).length;
    if (transactionsCount) {
      const transaction = Object.entries(this.getTransactions())[transactionsCount - 1][1].transaction;
      return transaction;
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

  async checkObject(req: { name: string; schema?: string; database?: string }): Promise<
    { name: string; schema?: string; database?: string; exists: boolean; oid?: number; dbdata?: any; type?: string }
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
    const executor = new ExecutorCreate(this.#driver, this.#logging);
    executor.create(req);
    return executor;
  }

  alter(req: { entity: string; schema?: string }) {
    if (!this.#driver) throw error({ name: "ErrorConnectionNull" });
    const executor = new ExecutorAlter(this.#driver, this.#logging);
    executor.alter(req);
    return executor;
  }

  drop(req: { entity: string; schema?: string } | { schema: string; check?: boolean }) {
    if (!this.#driver) throw error({ name: "ErrorConnectionNull" });
    const executor: ExecutorDrop = new ExecutorDrop(this.#driver, this.#logging);
    executor.drop(req);
    return executor;
  }

  rename(from: { entity: string; schema?: string }, to?: { entity: string; schema?: string }) {
    if (!this.#driver) throw error({ name: "ErrorConnectionNull" });
    const executor: ExecutorRename = new ExecutorRename(this.#driver, this.#logging);
    executor.rename(from, to);
    return executor;
  }

  select(...columns: Array<{ column: string; as?: string } | [string, string?]>) {
    if (!this.#driver) throw error({ name: "ErrorConnectionNull" });
    const executor: ExecutorSelect = new ExecutorSelect(this.#driver, this.getTransaction(), this.#logging);
    executor.select(...columns);
    return executor;
  }

  selectDistinct(...columns: Array<{ column: string; as?: string } | [string, string?]>) {
    if (!this.#driver) throw error({ name: "ErrorConnectionNull" });
    const executor: ExecutorSelect = new ExecutorSelect(this.#driver, this.getTransaction(), this.#logging);
    executor.selectDistinct(...columns);
    return executor;
  }

  /**
   * The SQL FROM clause is used to list the entity.
   * @param {Function} entity Entity class
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... let qb = db.from(SelectEntity1);
   * ```
   */
  from(entity: Function): ExecutorSelect;

  /**
   * The SQL FROM clause is used to list the entity.
   * @param {Function} entity Entity class
   * @param {string} as Param is used to rename a entity with an alias.
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... let qb = db.from(SelectEntity1, "u");
   * ```
   */
  from(entity: Function, as: string): ExecutorSelect;

  /**
   * The SQL FROM clause is used to list the entity.
   * @param {string} entityName Entity class name
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... let qb = db.from("User");
   * ```
   */
  from(entityName: string): ExecutorSelect;

  /**
   * The SQL FROM clause is used to list the entity.
   * @param {string} entityName Entity class name, use a period to specify a squema like `schema.Entity`
   * @param {string} as Param is used to rename a entity with an alias.
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... let qb = db.from("User", "u");
   * ```
   */
  from(entityName: string, as: string): ExecutorSelect;

  /**
   * The SQL FROM clause is used to list the entity or sub-query.
   * @param {ExecutorSelect} subQuery Another ExecutorSelect
   * @param {string} as Param is used to rename a sub-query with an alias.
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... let qb = db.from(db.from(User));
   * ```
   * - Result query
   * ```sql
   *  ... SELECT * FROM ( SELECT * FROM "User" )
   * ```
   */
  from(subQuery: ExecutorSelect): ExecutorSelect;

  /**
   * The SQL FROM clause is used to list the entity or sub-query.
   * @param {ExecutorSelect} subQuery Another ExecutorSelect
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... let qb = db.from(db.from(User), "u");
   * ```
   * - Result query
   * ```sql
   *  ... SELECT "u".* FROM ( SELECT * FROM "User" ) AS "u"
   * ```
   */
  from(subQuery: ExecutorSelect, as: string): ExecutorSelect;

  /**
   * The SQL FROM clause is used to list the entity.
   * @param {string} fromOption From option
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... let qb = db.from({ entity: User, as: "u"});
   *  ... let qb = db.from({ schema: "hello", entity: "User", as: "u"});
   * ```
   */
  from(fromOption: ParamFromOptions): ExecutorSelect;
  /**
   * Base function
   */
  from(
    // deno-lint-ignore camelcase
    entity_entityName_subQuery_fromOption: Function | string | ExecutorSelect | ParamFromOptions,
    // deno-lint-ignore camelcase
    maybe_as?: string,
  ): ExecutorSelect {
    if (!this.#driver) throw error({ name: "ErrorConnectionNull" });
    const executor: ExecutorSelect = new ExecutorSelect(this.#driver, this.getTransaction(), this.#logging);
    executor.from(<any> entity_entityName_subQuery_fromOption, <any> maybe_as);
    return executor;
  }

  update<T>(req: ParamUpdateEntity) {
    if (!this.#driver) throw error({ name: "ErrorConnectionNull" });
    const executor: ExecutorUpdate<T> = new ExecutorUpdate(this.#driver, this.getTransaction(), this.#logging);
    executor.update(req);
    return executor;
  }

  insert<T>(req: ParamInsertEntity) {
    if (!this.#driver) throw error({ name: "ErrorConnectionNull" });
    const executor: ExecutorInsert<T> = new ExecutorInsert(this.#driver, this.getTransaction(), this.#logging);
    executor.insert(req);
    return executor;
  }

  delete(
    req: { entity: string; schema?: string } | [string, string?] | Function,
  ) {
    if (!this.#driver) throw error({ name: "ErrorConnectionNull" });
    const executor: ExecutorDelete = new ExecutorDelete(this.#driver, this.getTransaction(), this.#logging);
    executor.delete(req);
    return executor;
  }

  upsert<T>(req: ParamUpsertEntity) {
    if (!this.#driver) throw error({ name: "ErrorConnectionNull" });
    const executor: ExecutorUpsert<T> = new ExecutorUpsert(this.#driver, this.getTransaction(), this.#logging);
    executor.upsert(req);
    return executor;
  }

  /**
   * Wraps given function execution (and all operations made there) in a transaction.
   */
  async startTransaction<T>(): Promise<T>;

  /**
   * Wraps given function execution (and all operations made there) in a transaction.
   */
  async startTransaction<T>(transactionName: string): Promise<T>;

  /**
   * Wraps given function execution (and all operations made there) in a transaction.
   */
  async startTransaction<T>(fun: () => Promise<T>): Promise<T>;

  /**
   * Wraps given function execution (and all operations made there) in a transaction.
   * using a transaction name
   */
  async startTransaction<T>(transactionName: string, fun: () => Promise<T>): Promise<T>;

  /**
   * Wraps given function execution (and all operations made there) in a transaction.
   */
  async startTransaction<T>(
    transactionNameOrFun?: string | ((conn?: this) => Promise<T>),
    fun?: ((conn?: this) => Promise<T>),
  ): Promise<T | any | undefined> {
    const transactionName =
      (transactionNameOrFun instanceof Function
        ? `transaction_${Object.keys(this.#transactions).length + 1}`
        : transactionNameOrFun) + "";
    const f = transactionNameOrFun instanceof Function ? transactionNameOrFun : fun;
    if (!this.#driver) return error({ name: "ErrorConnectionNull" });
    // if (!f) return error({ name: "ErrorParamIsRequired" });
    const err = undefined;
    let r;
    try {
      r = await this.#driver.createAndBeginTransaction({ transactionName });
      if (!r?.transaction) return error({ name: "ErrorTransactionNull" });
      this.getTransactions()[transactionName] = r;
      if (f) {
        const data = await f(this);
        const _ = await this.#driver.commitAndCloseTransaction(r);
        delete this.getTransactions()[transactionName];
        return data;
      }
    } catch (ex) {
      if (r?.transaction) {
        const _ = await this.#driver.rollbackAndCloseTransaction(r);
        delete this.getTransactions()[transactionName];
      }
      return err;
    }
  }

  async rollbackTransaction(transactionName?: string): Promise<boolean> {
    if (!this.#driver) return false;
    const transactionsCount = Object.entries(this.getTransactions()).length;
    if (transactionsCount) {
      if (transactionName) {
        const x = Object.entries(this.getTransactions()).find((x) => x[0] === transactionName);
        if (!x) {
          return false;
        }
        const _ = await this.#driver.rollbackAndCloseTransaction(x[1]);
        delete this.getTransactions()[x[0]];
      } else {
        const x = Object.entries(this.getTransactions())[transactionsCount - 1];
        const _ = await this.#driver.rollbackAndCloseTransaction(x[1]);
        delete this.getTransactions()[x[0]];
      }
      return true;
    }
    return false;
  }

  async commitTransaction(transactionName?: string): Promise<boolean> {
    if (!this.#driver) return false;
    const transactionsCount = Object.entries(this.getTransactions()).length;
    if (transactionsCount) {
      if (transactionName) {
        const x = Object.entries(this.getTransactions()).find((x) => x[0] === transactionName);
        if (!x) {
          return false;
        }
        const _ = await this.#driver.commitAndCloseTransaction(x[1]);
        delete this.getTransactions()[x[0]];
      } else {
        const x = Object.entries(this.getTransactions())[transactionsCount - 1];
        const _ = await this.#driver.commitAndCloseTransaction(x[1]);
        delete this.getTransactions()[x[0]];
      }
      return true;
    }
    return false;
  }

  async execute(query: string, changes?: any): Promise<ExecuteResult> {
    if (!this.#driver) throw error({ name: "ErrorConnectionNull" });
    const options: Record<string, any> = { changes };
    if (this.getTransaction()) {
      options.transaction = this.getTransaction();
    }
    if (this.#logging) {
      await this.#logging.write({
        logginKey: `query`,
        file: path.fromFileUrl(import.meta.url),
        className: this.constructor.name,
        functionName: `execute`,
        outLine: query.replace(/\n/ig, " "),
      });
    }
    const data = await this.#driver.execute(query, options);
    return data;
  }
}

export { Connection };
