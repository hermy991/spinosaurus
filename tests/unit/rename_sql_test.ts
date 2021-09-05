import { getTestConnection } from "./tool/tool.ts";
import { Connection } from "spinosaurus/mod.ts";
import { assertEquals } from "deno/testing/asserts.ts";

const con1 = getTestConnection();
/*********************
 * ENTITY DDL QUERY
 *********************/
Deno.test("rename [rename table] sql", () => {
  const db: Connection = new Connection(con1);
  const qs = db.rename({ entity: "User", schema: "public" }, {
    entity: "Person",
    schema: "def",
  });
  const query = qs.getSql();
  const queryExpected = `ALTER TABLE "public"."User" RENAME TO "Person"`;
  assertEquals(query, queryExpected);
});
Deno.test("rename [rename column table] sql", () => {
  const db: Connection = new Connection(con1);
  const qs = db.rename({ entity: "User", schema: "public" })
    .columns(["column11", "column12"], ["column21", "column22"]);
  const query = qs.getSql();
  const queryExpected =
    `ALTER TABLE "public"."User" RENAME COLUMN "column11" TO "column12";
ALTER TABLE "public"."User" RENAME COLUMN "column21" TO "column22"`;
  assertEquals(query, queryExpected);
});
Deno.test("rename [rename table and column] sql", () => {
  const db: Connection = new Connection(con1);
  const qs = db.rename(
    { entity: "User", schema: "public" },
    { entity: "Person", schema: "def" },
  ).columns(["column11", "column12"], ["column21", "column22"]);
  const query = qs.getSql();
  const queryExpected = `ALTER TABLE "public"."User" RENAME TO "Person";
ALTER TABLE "public"."Person" RENAME COLUMN "column11" TO "column12";
ALTER TABLE "public"."Person" RENAME COLUMN "column21" TO "column22"`;
  assertEquals(query, queryExpected);
});
