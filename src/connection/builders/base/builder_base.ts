import { ConnectionAll } from "../../connection_type.ts";
import { clearNames } from "./sql.ts";
import { createHash } from "deno/hash/mod.ts";
import {
  getMetadataChecks,
  getMetadataColumns,
  getMetadataEntityData,
} from "../../../decorators/metadata/metadata.ts";

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
  constructor(public conn: ConnectionAll) {
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
    const { prefix, schema, entity, column, name, sequence } = req;
    let generated = `${prefix.toUpperCase().trim()}`;
    if (schema) {
      generated += `_${schema.trim()}`;
    }
    if (entity) {
      generated += `_${entity.trim()}`;
    }
    if (column) {
      generated += `_${column.trim()}`;
    }
    if (name) {
      generated += `_${name.trim()}`;
    }
    if (sequence) {
      // generated += `_${btoa(sequence + "").replaceAll("=", "").toLowerCase()}`;
      const hash = createHash("md5");
      hash.update(`${btoa(sequence + "")}`);
      generated += `_${hash.toString().substr(0, 6)}`;
    }
    return generated;
  };
  getEntityData(connName: string, entity: Function) {
    return getMetadataEntityData({ connName, entity });
  }
  getColumns(connName: string, entity: Function): Array<any> {
    return getMetadataColumns({ connName, entity });
  }
  getChecks(connName: string, entity: Function): Array<any> {
    return getMetadataChecks({ connName, entity });
  }
}
