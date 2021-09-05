import { getTestConnection } from "./tool/tool.ts";
import { Connection } from "spinosaurus/mod.ts";
import { assertEquals } from "deno/testing/asserts.ts";

const con1 = getTestConnection();

Deno.test("delete [delete] sql", () => {
  const db: Connection = new Connection(con1);
  const query = db.delete(["User"]).getSql();
  const queryExpected = `DELETE FROM "User"`.replaceAll(/[ \n\t]+/ig, " ")
    .trim();
  assertEquals(query, queryExpected);
});

Deno.test("delete [delete 'Entity'] sql", async () => {
  const { FromEntity1, FromEntity2, FromEntity4, FromEntity5 } = await import(
    "./playground/decorators/FromEntity.ts"
  );
  const db: Connection = new Connection(con1);
  const q1 = db.delete(FromEntity1).getSql();
  const qe1 = `DELETE FROM "FromEntity1"`.replaceAll(/[ \n\t]+/ig, " ")
    .trim();
  assertEquals(q1, qe1);

  const q2 = db.delete(FromEntity2).getSql();
  const qe2 = `DELETE FROM "FromEntity2"`.replaceAll(/[ \n\t]+/ig, " ")
    .trim();
  assertEquals(q2, qe2);

  const q3 = db.delete(FromEntity4).getSql();
  const qe3 = `DELETE FROM "FromEntity3"`.replaceAll(/[ \n\t]+/ig, " ")
    .trim();
  assertEquals(q3, qe3);

  const q5 = db.delete(FromEntity5).getSql();
  const qe5 = `DELETE FROM "hello"."FromEntity5"`.replaceAll(
    /[ \n\t]+/ig,
    " ",
  )
    .trim();
  assertEquals(q5, qe5);
});
Deno.test("delete [delete with where] sql", () => {
  const db: Connection = new Connection(con1);
  const query = db.delete(["User"])
    .where([`"column1" = 10`])
    .getSql();
  const queryExpected = `DELETE FROM "User" WHERE "column1" = 10`.replaceAll(
    /[ \n\t]+/ig,
    " ",
  ).trim();
  assertEquals(query, queryExpected);
});
Deno.test("delete [delete with schema] sql", () => {
  const db: Connection = new Connection(con1);
  const query = db.delete(["User", "bill"])
    .where([`"column1" = 10`])
    .getSql();
  const queryExpected = `DELETE FROM "bill"."User" WHERE "column1" = 10`;
  assertEquals(query, queryExpected);
});
