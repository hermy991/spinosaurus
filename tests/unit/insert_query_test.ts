import {getTestConnection} from "./tool/tool.ts";
import { Connection, like, notLike, between } from "spinosaurus/mod.ts";
import { assert, assertEquals } from "deno/testing/asserts.ts";
//import {Connection} from '../spinosaurus/mod.ts'

//159.89.182.194, localhost
let host = Deno.env.get("SPINOSAURUS_TEST_CON_HOST") || "localhost";
let port = Number(Deno.env.get("SPINOSAURUS_TEST_CON_PORT") || 5432);
let username = Deno.env.get("SPINOSAURUS_TEST_CON_USERNAME") || "neo";
let password = Deno.env.get("SPINOSAURUS_TEST_CON_PASSWORD") || "123456";

let con1 = getTestConnection()

const testMessage = "  {}";

Deno.test(testMessage.replace(/\{\}/ig, "insert [insert] query should work"), async () => {
  let db: Connection = new Connection(con1);
  let qs = db.insert(["User"])
             .values({ column1: "xx" });
  let query = qs.getQuery() || "";
  query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
  let querySpected = `INSERT INTO "User" ("column1") VALUES ('xx')`.replaceAll(/[ \n\t]+/ig, " ").trim();;
  assertEquals(query, querySpected);
});
Deno.test(testMessage.replace(/\{\}/ig, "insert [multiple insert] query should work"), async () => {
  let db: Connection = new Connection(con1);
  let qs = db.insert(["User"])
             .values([{ column1: "x1" }, { column1: "x2" }]);
  let query = qs.getQuery() || "";
  query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
  let querySpected = `INSERT INTO "User" ("column1") VALUES ('x1'); INSERT INTO "User" ("column1") VALUES ('x2')`.replaceAll(/[ \n\t]+/ig, " ").trim();;
  assertEquals(query, querySpected);
});
Deno.test(testMessage.replace(/\{\}/ig, "insert [multiple insert with schema] query should work"), async () => {
  let db: Connection = new Connection(con1);
  let qs = db.insert(["User", "public"])
             .values([{ column1: "x1" }, { column1: "x2" }]);
  let query = qs.getQuery() || "";
  query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
  let querySpected = `INSERT INTO "public"."User" ("column1") VALUES ('x1'); INSERT INTO "public"."User" ("column1") VALUES ('x2')`.replaceAll(/[ \n\t]+/ig, " ").trim();;
  assertEquals(query, querySpected);
});
