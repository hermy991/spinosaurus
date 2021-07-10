import { getTestConnection } from "./tool/tool.ts";
import { Connection } from "spinosaurus/mod.ts";
import { assertEquals } from "deno/testing/asserts.ts";
//import {Connection} from '../spinosaurus/mod.ts'

const con1 = getTestConnection();

const testMessage = "  {}";

Deno.test(
  testMessage.replace(/\{\}/ig, "insert [insert] query should work"),
  () => {
    const db: Connection = new Connection(con1);
    const qs = db.insert(["User"])
      .values({ column1: "xx" });
    let query = qs.getQuery() || "";
    query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
    const queryExpected = `INSERT INTO "User" ("column1") VALUES ('xx')`
      .replaceAll(/[ \n\t]+/ig, " ").trim();
    assertEquals(query, queryExpected);
  },
);
Deno.test(
  testMessage.replace(/\{\}/ig, "insert [multiple insert] query should work"),
  () => {
    const db: Connection = new Connection(con1);
    const qs = db.insert(["User"])
      .values([{ column1: "x1" }, { column1: "x2" }]);
    let query = qs.getQuery() || "";
    query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
    const queryExpected =
      `INSERT INTO "User" ("column1") VALUES ('x1'); INSERT INTO "User" ("column1") VALUES ('x2')`
        .replaceAll(/[ \n\t]+/ig, " ").trim();
    assertEquals(query, queryExpected);
  },
);
Deno.test(
  testMessage.replace(
    /\{\}/ig,
    "insert [multiple insert with schema] query should work",
  ),
  () => {
    const db: Connection = new Connection(con1);
    const qs = db.insert(["User", "public"])
      .values([{ column1: "x1" }, { column1: "x2" }]);
    let query = qs.getQuery() || "";
    query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
    const queryExpected =
      `INSERT INTO "public"."User" ("column1") VALUES ('x1'); INSERT INTO "public"."User" ("column1") VALUES ('x2')`
        .replaceAll(/[ \n\t]+/ig, " ").trim();
    assertEquals(query, queryExpected);
  },
);
