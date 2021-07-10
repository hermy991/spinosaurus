import { getTestConnection } from "./tool/tool.ts";
import { Connection } from "spinosaurus/mod.ts";
import { assertEquals } from "deno/testing/asserts.ts";
//import {Connection} from '../spinosaurus/mod.ts'

const con1 = getTestConnection();
const testMessage = "  {}";
/*********************
 * ENTITY DDL QUERY
 *********************/
Deno.test(
  testMessage.replace(/\{\}/ig, "rename [rename table] query should work"),
  () => {
    const db: Connection = new Connection(con1);
    const qs = db.rename({ entity: "User", schema: "public" }, {
      entity: "Person",
      schema: "def",
    });
    let query = qs.getQuery() || "";
    query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
    const queryExpected = `ALTER TABLE "public"."User" RENAME TO "def"."Person"`
      .replace(/[ \n\t]+/ig, " ").trim();
    assertEquals(query, queryExpected);
  },
);
Deno.test(
  testMessage.replace(
    /\{\}/ig,
    "rename [rename column table] query should work",
  ),
  () => {
    const db: Connection = new Connection(con1);
    const qs = db.rename({ entity: "User", schema: "public" })
      .columns(["column11", "column12"], ["column21", "column22"]);
    let query = qs.getQuery() || "";
    query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
    const queryExpected =
      `ALTER TABLE "public"."User" RENAME COLUMN "column11" TO "column12";\nALTER TABLE "public"."User" RENAME COLUMN "column21" TO "column22"`
        .replace(/[ \n\t]+/ig, " ").trim();
    assertEquals(query, queryExpected);
  },
);
Deno.test(
  testMessage.replace(
    /\{\}/ig,
    "rename [rename table and column] query should work",
  ),
  () => {
    const db: Connection = new Connection(con1);
    const qs = db.rename({ entity: "User", schema: "public" }, {
      entity: "Person",
      schema: "def",
    })
      .columns(["column11", "column12"], ["column21", "column22"]);
    let query = qs.getQuery() || "";
    query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
    const queryExpected =
      `ALTER TABLE "public"."User" RENAME TO "def"."Person";\nALTER TABLE "def"."Person" RENAME COLUMN "column11" TO "column12"; \nALTER TABLE "def"."Person" RENAME COLUMN "column21" TO "column22"`
        .replace(/[ \n\t]+/ig, " ").trim();
    assertEquals(query, queryExpected);
  },
);
