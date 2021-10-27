import { Driver } from "../../connection_type.ts";
import { clearNames, generateName1 } from "./sql.ts";
import { getMetadataChecks, getMetadataColumns, getMetadataEntityData } from "../../../decorators/metadata/metadata.ts";

export class BuilderBase {
  #printSql = false;
  get #left() {
    return this.conn.delimiters[0];
  }
  get #right() {
    if (this.conn.delimiters.length == 1) {
      return this.conn.delimiters[0];
    }
    return this.conn.delimiters[1] + "";
  }
  get delimiters() {
    return <string[]> this.conn.delimiters;
  }
  constructor(public conn: Driver) {
  }
  printSql = () => {
    this.#printSql = true;
  };
  usePrintSql = (sqls: string | string[]) => {
    if (this.#printSql) {
      this.#printSql = false;
      const tsql = Array.isArray(sqls) ? sqls.join(";\n") : sqls;
      if (tsql) {
        console.log(tsql);
      }
      return true;
    }
    return false;
  };
  clearNames = (
    identifiers?: Array<string | undefined> | string | undefined,
  ) => {
    return clearNames({ left: this.#left, identifiers, right: this.#right });
  };
  generateName1 = (
    req: {
      prefix: string;
      schema?: string;
      entity?: string;
      column?: string;
      name?: string;
      sequence: number;
    },
  ) => {
    return generateName1(req);
  };
  getEntityData(connName: string, entity: Function | Record<string, unknown>) {
    return getMetadataEntityData({ connName, entity });
  }
  getColumns(connName: string, entity: Function | Record<string, unknown>): Array<any> {
    return getMetadataColumns({ connName, entity });
  }
  getChecks(connName: string, entity: Function): Array<any> {
    return getMetadataChecks({ connName, entity });
  }
}
