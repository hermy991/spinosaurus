import { ConnectionAll } from "../../connection_type.ts";
import { clearNames } from "./sql.ts";

export class BuilderBase {
  get left() {
    return this.conn.delimiters[0];
  }
  get right() {
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
    return clearNames({ left: this.left, identifiers, right: this.right });
  };
}
