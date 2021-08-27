import { getTestConnection } from "./tool/tool.ts";
import { Connection } from "spinosaurus/mod.ts";
import { assertEquals } from "deno/testing/asserts.ts";

const con1 = getTestConnection();
/*********************
 * ENTITY DDL QUERY
 *********************/
Deno.test("drop [drop table] sql", () => {
  const db: Connection = new Connection(con1);
  let query = db.drop({ entity: "User", schema: "public" }).getSql() || "";
  query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
  const queryExpected = `DROP TABLE "public"."User"`.replace(
    /[ \n\t]+/ig,
    " ",
  )
    .trim();
  assertEquals(query, queryExpected);
});
Deno.test("drop [drop table colums] sql", () => {
  const db: Connection = new Connection(con1);
  let query = db.drop({ entity: "User", schema: "public" })
    .columns(["prueba"])
    .getSql() || "";
  query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
  const queryExpected = `ALTER TABLE "public"."User" DROP COLUMN "prueba"`
    .replace(/[ \n\t]+/ig, " ").trim();
  assertEquals(query, queryExpected);
});
Deno.test("drop [drop schema] sql", () => {
  const db: Connection = new Connection(con1);
  let q1 = db.drop({ schema: "publicX" })
    .getSql() || "";
  q1 = q1.replaceAll(/[ \n\t]+/ig, " ").trim();
  const qe1 = `DROP SCHEMA "publicX"`
    .replace(/[ \n\t]+/ig, " ").trim();
  assertEquals(q1, qe1);

  let q2 = db.drop({ schema: "publicX", check: true })
    .getSql() || "";
  q2 = q2.replaceAll(/[ \n\t]+/ig, " ").trim();
  const qe2 = `DROP SCHEMA IF EXISTS "publicX"`
    .replace(/[ \n\t]+/ig, " ").trim();
  assertEquals(q2, qe2);
});
