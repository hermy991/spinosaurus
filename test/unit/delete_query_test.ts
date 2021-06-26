import {getTestConnection} from "./tool/tool.ts";
import { Connection, like, notLike, between } from "spinosaurus/mod.ts";
import { assert, assertEquals } from "deno/testing/asserts.ts";
//import {Connection} from '../spinosaurus/mod.ts'

let con1 = getTestConnection();

const testMessage = "  {}";

Deno.test(testMessage.replace(/\{\}/ig, "delete [delete] query should work"), async () => {
  let db: Connection = new Connection(con1);
  let query = db.delete(["User"])
                .getQuery() || "";
  query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
  let querySpected = `DELETE FROM "User"`.replaceAll(/[ \n\t]+/ig, " ").trim();;
  assertEquals(query, querySpected);
});
Deno.test(testMessage.replace(/\{\}/ig, "delete [delete with where] query should work"), async () => {
  let db: Connection = new Connection(con1);
  let query = db.delete(["User"])
                .where([`"column1" = 10`])
                .getQuery() || "";
  query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
  let querySpected = `DELETE FROM "User" WHERE "column1" = 10`.replaceAll(/[ \n\t]+/ig, " ").trim();;
  assertEquals(query, querySpected);
});
Deno.test(testMessage.replace(/\{\}/ig, "delete [delete with schema] query should work"), async () => {
  let db: Connection = new Connection(con1);
  let query = db.delete(["User", "bill"])
                .where([`"column1" = 10`])
                .getQuery() || "";
  query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
  let querySpected = `DELETE FROM "bill"."User" WHERE "column1" = 10`.replaceAll(/[ \n\t]+/ig, " ").trim();;
  assertEquals(query, querySpected);
});