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
  testMessage.replace(/\{\}/ig, "create [create table] query should work"),
  () => {
    const db: Connection = new Connection(con1);
    const qs = db.create({ entity: "User", schema: "public" })
      .columns({ columnName: "column1", spitype: "varchar" });
    let query = qs.getQuery() || "";
    query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
    const queryExpected = `CREATE TABLE "public"."User" ( "column1" VARCHAR )`
      .replace(/[ \n\t]+/ig, " ").trim();
    assertEquals(query, queryExpected);
  },
);
Deno.test(
  testMessage.replace(
    /\{\}/ig,
    "create [create table with data] query should work",
  ),
  () => {
    const db: Connection = new Connection(con1);
    const qs = db.create({ entity: "User", schema: "public" })
      .columns({ columnName: "column1", spitype: "varchar" })
      .data([{ column1: "hola" }, { column1: "xx" }]);
    let query = qs.getQuery() || "";
    query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
    const queryExpected =
      `CREATE TABLE "public"."User" ( "column1" VARCHAR ); INSERT INTO "public"."User" ("column1") VALUES ('hola'); INSERT INTO "public"."User" ("column1") VALUES ('xx')`
        .replace(/[ \n\t]+/ig, " ").trim();
    assertEquals(query, queryExpected);
  },
);
Deno.test(
  testMessage.replace(/\{\}/ig, "create [create schema] query should work"),
  () => {
    const db: Connection = new Connection(con1);
    let q1 = db.create({ schema: "publicX" })
      .getQuery() || "";
    q1 = q1.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe1 = `CREATE SCHEMA "publicX"`
      .replace(/[ \n\t]+/ig, " ").trim();
    assertEquals(q1, qe1);

    let q2 = db.create({ schema: "publicX", check: true })
      .getQuery() || "";
    q2 = q2.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe2 = `CREATE SCHEMA IF NOT EXISTS "publicX"`
      .replace(/[ \n\t]+/ig, " ").trim();
    assertEquals(q2, qe2);
  },
);
