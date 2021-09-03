import { getTestConnection } from "./tool/tool.ts";
import { Connection } from "spinosaurus/mod.ts";
import { assertEquals } from "deno/testing/asserts.ts";

const con1 = getTestConnection();
/*********************
 * ENTITY DDL QUERY
 *********************/
Deno.test("drop [drop table] sql", () => {
  const db: Connection = new Connection(con1);
  const query = db.drop({ entity: "User", schema: "public" }).getSqls().join(
    "; ",
  );
  const queryExpected = `DROP TABLE "public"."User"`.replace(
    /[ \n\t]+/ig,
    " ",
  )
    .trim();
  assertEquals(query, queryExpected);
});
Deno.test("drop [drop table colums] sql", () => {
  const db: Connection = new Connection(con1);
  const query = db.drop({ entity: "User", schema: "public" })
    .columns(["prueba"])
    .getSqls().join(";\n");
  const queryExpected = `ALTER TABLE "public"."User" DROP COLUMN "prueba"`;
  assertEquals(query, queryExpected);
});
Deno.test("drop [drop schema] sql", () => {
  const db: Connection = new Connection(con1);
  const q1 = db.drop({ schema: "publicX" })
    .getSqls().join(";\n");
  const qe1 = `DROP SCHEMA "publicX"`;
  assertEquals(q1, qe1);

  const q2 = db.drop({ schema: "publicX", check: true })
    .getSqls().join(";\n");
  const qe2 = `DROP SCHEMA IF EXISTS "publicX"`;
  assertEquals(q2, qe2);
});
