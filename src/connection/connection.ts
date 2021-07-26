// import {path} from "../../deps.ts";
import { ConnectionPostgres } from "./postgres/connection_postgres.ts";
import { ConnectionPostgresOptions } from "./postgres/connection_postgres_options.ts";
import { error } from "../error/error_utills.ts";
import { ExecutorDrop } from "./executors/executor_drop.ts";
import { ExecutorCreate } from "./executors/executor_create.ts";
import { ExecutorAlter } from "./executors/executor_alter.ts";
import { ExecutorSelect } from "./executors/executor_select.ts";
import { ExecutorRename } from "./executors/executor_rename.ts";
import { ExecutorInsert } from "./executors/executor_insert.ts";
import { ExecutorUpdate } from "./executors/executor_update.ts";
import { ExecutorDelete } from "./executors/executor_delete.ts";
import { ExecuteResult } from "./execute_result.ts";

class Connection {
  #connection?: ConnectionPostgres;

  constructor(options: ConnectionPostgresOptions) {
    if (options && options.type === "postgres") {
      this.#connection = new ConnectionPostgres(
        options.name,
        options.type,
        options.host,
        options.port,
        options.username,
        options.password,
        options.database,
        options.synchronize,
        options.entities,
        options.hostaddr,
      );
    }
  }

  getConnection(): ConnectionPostgres {
    if (!this.#connection) throw error({ name: "ErrorConnectionNull" });
    return this.#connection;
  }

  async test(): Promise<boolean> {
    if (!this.#connection) throw error({ name: "ErrorConnectionNull" });
    const defConn = this.#connection;
    const res = await defConn.test();
    return res;
  }

  async checkSchema(req: { name: string }) {
    if (!this.#connection) throw error({ name: "ErrorConnectionNull" });
    const defConn = this.#connection;
    const res = await defConn.checkSchema(req);
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
    const defConn = this.#connection;
    const res = await defConn.checkObject(req);
    return res;
  }

  async getCurrentDatabase() {
    if (!this.#connection) throw error({ name: "ErrorConnectionNull" });
    const defConn = this.#connection;
    const res = await defConn.getCurrentDatabase();
    return res;
  }

  async getCurrentSchema() {
    if (!this.#connection) throw error({ name: "ErrorConnectionNull" });
    const defConn = this.#connection;
    const res = await defConn.getCurrentSchema();
    return res;
  }

  create(
    req: { entity: string; schema?: string } | {
      schema: string;
      check?: boolean;
    },
  ) {
    if (!this.#connection) throw error({ name: "ErrorConnectionNull" });
    const defConn = this.#connection;
    const executor = new ExecutorCreate(defConn);
    executor.create(req);
    return executor;
  }

  alter(req: { entity: string; schema?: string }) {
    if (!this.#connection) throw error({ name: "ErrorConnectionNull" });
    const defConn = this.#connection;
    const executor = new ExecutorAlter(defConn);
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
    const defConn = this.#connection;
    const executor: ExecutorDrop = new ExecutorDrop(defConn);
    executor.drop(req);
    return executor;
  }

  rename(
    from: { entity: string; schema?: string },
    to?: { entity: string; schema?: string },
  ) {
    if (!this.#connection) throw error({ name: "ErrorConnectionNull" });
    const defConn = this.#connection;
    const executor: ExecutorRename = new ExecutorRename(defConn);
    executor.rename(from, to);
    return executor;
  }

  select(
    ...columns: Array<{ column: string; as?: string } | [string, string?]>
  ) {
    if (!this.#connection) throw error({ name: "ErrorConnectionNull" });
    const defConn = this.#connection;
    const executor: ExecutorSelect = new ExecutorSelect(defConn);
    executor.select(...columns);
    return executor;
  }

  selectDistinct(
    ...columns: Array<{ column: string; as?: string } | [string, string?]>
  ) {
    if (!this.#connection) throw error({ name: "ErrorConnectionNull" });
    const defConn = this.#connection;
    const executor: ExecutorSelect = new ExecutorSelect(defConn);
    executor.selectDistinct(...columns);
    return executor;
  }

  update(req: { entity: string; schema?: string } | [string, string?]) {
    if (!this.#connection) throw error({ name: "ErrorConnectionNull" });
    const defConn = this.#connection;
    const executor: ExecutorUpdate = new ExecutorUpdate(defConn);
    executor.update(req);
    return executor;
  }

  insert(req: { entity: string; schema?: string } | [string, string?]) {
    if (!this.#connection) throw error({ name: "ErrorConnectionNull" });
    const defConn = this.#connection;
    const executor: ExecutorInsert = new ExecutorInsert(defConn);
    executor.insert(req);
    return executor;
  }

  delete(req: { entity: string; schema?: string } | [string, string?]) {
    if (!this.#connection) throw error({ name: "ErrorConnectionNull" });
    const defConn = this.#connection;
    const executor: ExecutorDelete = new ExecutorDelete(defConn);
    executor.delete(req);
    return executor;
  }

  async execute(query: string, changes?: any): Promise<ExecuteResult> {
    if (!this.#connection) throw error({ name: "ErrorConnectionNull" });
    const defConn = this.#connection;
    const data = await defConn.execute(query, changes);
    return data;
  }
}

export { Connection };
