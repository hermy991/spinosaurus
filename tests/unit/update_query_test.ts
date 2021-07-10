import { getTestConnection } from "./tool/tool.ts";
import { Connection } from "spinosaurus/mod.ts";
import { assertEquals } from "deno/testing/asserts.ts";
//import {Connection} from '../spinosaurus/mod.ts'

const con1 = getTestConnection();

const testMessage = "  {}";

Deno.test(
  testMessage.replace(/\{\}/ig, "update [update] query should work"),
  () => {
    const db: Connection = new Connection(con1);
    const qs = db.update(["User"])
      .set(["column1", "xx"], ["column2", "ss"]);
    let query = qs.getQuery() || "";
    query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
    const queryExpected = `UPDATE "User" SET "column1" = 'xx', "column2" = 'ss'`
      .replaceAll(/[ \n\t]+/ig, " ").trim();
    assertEquals(query, queryExpected);
  },
);
Deno.test(
  testMessage.replace(/\{\}/ig, "update [update with where] query should work"),
  () => {
    const db: Connection = new Connection(con1);
    const qs = db.update(["User"])
      .set({ column1: "xx", column2: "ss" })
      .where([`"user_ID" = 5`]);
    let query = qs.getQuery() || "";
    query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
    const queryExpected =
      `UPDATE "User" SET "column1" = 'xx', "column2" = 'ss' WHERE "user_ID" = 5`
        .replaceAll(/[ \n\t]+/ig, " ").trim();
    assertEquals(query, queryExpected);
  },
);
Deno.test(
  testMessage.replace(
    /\{\}/ig,
    "update [update with schema] query should work",
  ),
  () => {
    const db: Connection = new Connection(con1);
    const qs = db.update(["User", "bill"])
      .set({ column1: "xx", column2: "ss" })
      .where([`"user_ID" = 5`]);
    let query = qs.getQuery() || "";
    query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
    const queryExpected =
      `UPDATE "bill"."User" SET "column1" = 'xx', "column2" = 'ss' WHERE "user_ID" = 5`
        .replaceAll(/[ \n\t]+/ig, " ").trim();
    assertEquals(query, queryExpected);
  },
);
