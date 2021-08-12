import { getTestConnection } from "./tool/tool.ts";
import { Connection } from "spinosaurus/mod.ts";
import { assertEquals } from "deno/testing/asserts.ts";

const con1 = getTestConnection();

Deno.test("update [update] query", () => {
  const db: Connection = new Connection(con1);
  const qs = db.update(["User"])
    .set(["column1", "xx"], ["column2", "ss"]);
  let query = qs.getQuery() || "";
  query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
  const queryExpected = `UPDATE "User" SET "column1" = 'xx', "column2" = 'ss'`
    .replaceAll(/[ \n\t]+/ig, " ").trim();
  assertEquals(query, queryExpected);
});

Deno.test("update [update 'Entity'] query", async () => {
  const { FromEntity1, FromEntity2, FromEntity4, FromEntity5 } = await import(
    "./playground/decorators/FromEntity.ts"
  );
  const db: Connection = new Connection(con1);
  const qs1 = db.update(FromEntity1)
    .set(["column1", "xx"], ["column2", "ss"]);
  let q1 = qs1.getQuery() || "";
  q1 = q1.replaceAll(/[ \n\t]+/ig, " ").trim();
  const qe1 = `UPDATE "FromEntity1" SET "column1" = 'xx', "column2" = 'ss'`
    .replaceAll(/[ \n\t]+/ig, " ").trim();
  assertEquals(q1, qe1);

  const qs2 = db.update(FromEntity2)
    .set(["column1", "xx"], ["column2", "ss"]);
  let q2 = qs2.getQuery() || "";
  q2 = q2.replaceAll(/[ \n\t]+/ig, " ").trim();
  const qe2 = `UPDATE "FromEntity2" SET "column1" = 'xx', "column2" = 'ss'`
    .replaceAll(/[ \n\t]+/ig, " ").trim();
  assertEquals(q2, qe2);

  const qs3 = db.update(FromEntity4)
    .set(["column1", "xx"], ["column2", "ss"]);
  let q3 = qs3.getQuery() || "";
  q3 = q3.replaceAll(/[ \n\t]+/ig, " ").trim();
  const qe3 = `UPDATE "FromEntity3" SET "column1" = 'xx', "column2" = 'ss'`
    .replaceAll(/[ \n\t]+/ig, " ").trim();
  assertEquals(q3, qe3);

  const qs4 = db.update(FromEntity5)
    .set(["column1", "xx"], ["column2", "ss"]);
  let q4 = qs4.getQuery() || "";
  q4 = q4.replaceAll(/[ \n\t]+/ig, " ").trim();
  const qe4 =
    `UPDATE "hello"."FromEntity5" SET "column1" = 'xx', "column2" = 'ss'`
      .replaceAll(/[ \n\t]+/ig, " ").trim();
  assertEquals(q4, qe4);
  5;
});
Deno.test("update [update with where] query", () => {
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
});
Deno.test("update [update with schema] query", () => {
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
});
