import { ConnectionAll } from "../../connection_type.ts";
import { clearNames } from "./sql.ts";
import { createHash } from "deno/hash/mod.ts";
import {
  linkMetadataToColumnAccesors,
  linkMetadataToFromData,
} from "../../../decorators/metadata/metadata.ts";

export class BuilderBase {
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
      const hash = createHash("md5");
      hash.update(`${btoa(sequence + "")}`);
      generated += `_${hash.toString()}`;
    }
    return generated;
  };
  getEntityData(connName: string, entity: Function | string, clauseData: any) {
    let tschema = clauseData.schema;
    let tentity = clauseData.entity;
    if (entity instanceof Function) {
      const clauseData = {
        ...linkMetadataToFromData({
          currentSquema: "",
          connName,
        }, <Function> entity),
      };
      tschema = clauseData.schema;
      tentity = clauseData.entity;
    }
    return { entity: tentity, schema: tschema };
  }
  getColumnAccesors(
    connName: string,
    entity: Function,
  ) {
    const columns = linkMetadataToColumnAccesors({
      currentSquema: "",
      connName,
    }, entity);
    return;
  }
}
