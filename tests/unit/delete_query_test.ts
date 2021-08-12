import { getTestConnection } from "./tool/tool.ts";
import { Connection } from "spinosaurus/mod.ts";
import { assertEquals } from "deno/testing/asserts.ts";

const con1 = getTestConnection();

Deno.test("delete [delete] query", () => {
  const db: Connection = new Connection(con1);
  let query = db.delete(["User"])
    .getQuery() || "";
  query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
  const queryExpected = `DELETE FROM "User"`.replaceAll(/[ \n\t]+/ig, " ")
    .trim();
  assertEquals(query, queryExpected);
});

Deno.test("delete [delete 'Entity'] query", async () => {
  const { FromEntity1, FromEntity2, FromEntity4, FromEntity5 } = await import(
    "./playground/decorators/FromEntity.ts"
  );
  const db: Connection = new Connection(con1);
  let q1 = db.delete(FromEntity1)
    .getQuery() || "";
  q1 = q1.replaceAll(/[ \n\t]+/ig, " ").trim();
  const qe1 = `DELETE FROM "FromEntity1"`.replaceAll(/[ \n\t]+/ig, " ")
    .trim();
  assertEquals(q1, qe1);

  let q2 = db.delete(FromEntity2)
    .getQuery() || "";
  q2 = q2.replaceAll(/[ \n\t]+/ig, " ").trim();
  const qe2 = `DELETE FROM "FromEntity2"`.replaceAll(/[ \n\t]+/ig, " ")
    .trim();
  assertEquals(q2, qe2);

  let q3 = db.delete(FromEntity4)
    .getQuery() || "";
  q3 = q3.replaceAll(/[ \n\t]+/ig, " ").trim();
  const qe3 = `DELETE FROM "FromEntity3"`.replaceAll(/[ \n\t]+/ig, " ")
    .trim();
  assertEquals(q3, qe3);

  let q5 = db.delete(FromEntity5)
    .getQuery() || "";
  q5 = q5.replaceAll(/[ \n\t]+/ig, " ").trim();
  const qe5 = `DELETE FROM "hello"."FromEntity5"`.replaceAll(
    /[ \n\t]+/ig,
    " ",
  )
    .trim();
  assertEquals(q5, qe5);
});
Deno.test("delete [delete with where] query", () => {
  const db: Connection = new Connection(con1);
  let query = db.delete(["User"])
    .where([`"column1" = 10`])
    .getQuery() || "";
  query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
  const queryExpected = `DELETE FROM "User" WHERE "column1" = 10`.replaceAll(
    /[ \n\t]+/ig,
    " ",
  ).trim();
  assertEquals(query, queryExpected);
});
Deno.test("delete [delete with schema] query", () => {
  const db: Connection = new Connection(con1);
  let query = db.delete(["User", "bill"])
    .where([`"column1" = 10`])
    .getQuery() || "";
  query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
  const queryExpected = `DELETE FROM "bill"."User" WHERE "column1" = 10`
    .replaceAll(/[ \n\t]+/ig, " ").trim();
  assertEquals(query, queryExpected);
});
