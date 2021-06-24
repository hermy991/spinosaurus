import { getTestConnection } from "./tool/tool.ts"
import { Connection, like, notLike, between } from "spinosaurus/mod.ts";
import { assert, assertEquals } from "deno/testing/asserts.ts";
//import {Connection} from '../spinosaurus/mod.ts'

let con1 = getTestConnection();
const testMessage = "  {}";
/*********************
 * ENTITY DDL QUERY
 *********************/
Deno.test(testMessage.replace(/\{\}/ig, "create [create table] query should work"), async () => {
  let db: Connection = new Connection(con1);
  let qs = db.create({ entity: "User", schema: "public"})
             .columns({columnName: "column1", datatype: "varchar" });
  let query = qs.getQuery() || "";
  query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
  let querySpected = `CREATE TABLE "public"."User" ( "column1" VARCHAR )`.replace(/[ \n\t]+/ig, " ").trim();
  assertEquals(query, querySpected);
});
Deno.test(testMessage.replace(/\{\}/ig, "create [create table with data] query should work"), async () => {
  let db: Connection = new Connection(con1);
  let qs = db.create({ entity: "User", schema: "public"})
             .columns({columnName: "column1", datatype: "varchar" })
             .data([{ column1: "hola"}, { column1: "xx"}]);
  let query = qs.getQuery() || "";
  query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
  let querySpected = `CREATE TABLE "public"."User" ( "column1" VARCHAR ); INSERT INTO "public"."User" ("column1") VALUES ('hola'); INSERT INTO "public"."User" ("column1") VALUES ('xx')`.replace(/[ \n\t]+/ig, " ").trim();
  assertEquals(query, querySpected);
});