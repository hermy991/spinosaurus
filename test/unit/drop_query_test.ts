import { getTestConnection } from "./tool/tool.ts"
import { Connection, like, notLike, between } from "spinosaurus/mod.ts";
import { assert, assertEquals } from "deno/testing/asserts.ts";
//import {Connection} from '../spinosaurus/mod.ts'

let con1 = getTestConnection();
const testMessage = "  {}";
/*********************
 * ENTITY DDL QUERY
 *********************/
Deno.test(testMessage.replace(/\{\}/ig, "drop [drop table] query should work"), async () => {
  let db: Connection = new Connection(con1);
  let qs = db.drop({ entity: "User", schema: "public"});
  let query = qs.getQuery() || "";
  query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
  let querySpected = `DROP TABLE "public"."User"`.replace(/[ \n\t]+/ig, " ").trim();
  assertEquals(query, querySpected);
});
Deno.test(testMessage.replace(/\{\}/ig, "drop [drop table colums] query should work"), async () => {
  let db: Connection = new Connection(con1);
  let qs = db.drop({ entity: "User", schema: "public"})
             .columns(["prueba"]);
  let query = qs.getQuery() || "";
  query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
  let querySpected = `ALTER TABLE "public"."User" DROP COLUMN "prueba"`.replace(/[ \n\t]+/ig, " ").trim();
  assertEquals(query, querySpected);
});