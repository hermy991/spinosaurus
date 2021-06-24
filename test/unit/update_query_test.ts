import {getTestConnection} from "./tool/tool.ts";
import { Connection, like, notLike, between } from "spinosaurus/mod.ts";
import { assert, assertEquals } from "deno/testing/asserts.ts";
//import {Connection} from '../spinosaurus/mod.ts'

let con1 = getTestConnection();

const testMessage = "  {}";

Deno.test(testMessage.replace(/\{\}/ig, "update [update] query should work"), async () => {
  let db: Connection = new Connection(con1);
  let qs = db.update(["User"])
             .set(["column1", "xx"], ["column2", "ss"]);
  let query = qs.getQuery() || "";
  query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
  let querySpected = `UPDATE "User" SET "column1" = 'xx', "column2" = 'ss'`.replaceAll(/[ \n\t]+/ig, " ").trim();;
  assertEquals(query, querySpected);
});
Deno.test(testMessage.replace(/\{\}/ig, "update [update with where] query should work"), async () => {
  let db: Connection = new Connection(con1);
  let qs = db.update(["User"])
             .set({column1: "xx", column2: "ss"})
             .where([`"user_ID" = 5`]);
  let query = qs.getQuery() || "";
  query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
  let querySpected = `UPDATE "User" SET "column1" = 'xx', "column2" = 'ss' WHERE "user_ID" = 5`.replaceAll(/[ \n\t]+/ig, " ").trim();;
  assertEquals(query, querySpected);
});
Deno.test(testMessage.replace(/\{\}/ig, "update [update with schema] query should work"), async () => {
  let db: Connection = new Connection(con1);
  let qs = db.update(["User", "bill"])
             .set({column1: "xx", column2: "ss"})
             .where([`"user_ID" = 5`]);
  let query = qs.getQuery() || "";
  query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
  let querySpected = `UPDATE "bill"."User" SET "column1" = 'xx', "column2" = 'ss' WHERE "user_ID" = 5`.replaceAll(/[ \n\t]+/ig, " ").trim();;
  assertEquals(query, querySpected);
});
