import { getTestConnection } from "./tool/tool.ts";
import { Connection } from "spinosaurus/mod.ts";
import { assertEquals } from "deno/testing/asserts.ts";
import * as luxon from "luxon/mod.ts";

const con1 = getTestConnection();

Deno.test("update [update] sql", () => {
  const db: Connection = new Connection(con1);
  const qs = db.update(["User"])
    .set({ column1: "xx", column2: "ss" });
  let query = qs.getQuery() || "";
  query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
  const queryExpected = `UPDATE "User" SET "column1" = 'xx', "column2" = 'ss'`
    .replaceAll(/[ \n\t]+/ig, " ").trim();
  assertEquals(query, queryExpected);
});

Deno.test("update [update 'Entity'] sql", async () => {
  const { UpdateEntity1, UpdateEntity2 } = await import(
    "./playground/decorators/UpdateEntity.ts"
  );
  const db: Connection = new Connection(con1);

  const updateColumn = new Date();
  const qs1 = db.update(UpdateEntity1)
    .set({
      primaryColumn: 1,
      column2: "ss",
      column3: "sss",
      versionColumn: 2,
      updateColumn,
    });
  let q1 = qs1.getQuery() || "";
  q1 = q1.replaceAll(/[ \n\t]+/ig, " ").trim();
  const qe1 =
    `UPDATE "schema"."UpdateEntityCustom" SET "column2" = 'ss', "columnCustom" = 'sss', "versionColumn" = 2, "updateColumn" = TO_TIMESTAMP('${
      luxon.DateTime.fromJSDate(updateColumn).toFormat("yyyy-MM-dd HH:mm:ss")
    }', 'YYYY-MM-DD HH24:MI:SS') WHERE "primaryColumn" = 1`
      .replaceAll(/[ \n\t]+/ig, " ").trim();
  assertEquals(q1, qe1);

  const qs2 = db.update(UpdateEntity2)
    .set({
      primaryGeneratedColumn: 1,
      column2: "ss",
      column3: "sss",
      column4: "dont show columns",
    });
  let q2 = qs2.getQuery() || "";
  q2 = q2.replaceAll(/[ \n\t]+/ig, " ").trim();
  const qe2 =
    `UPDATE "schema"."UpdateEntity2" SET "column2" = 'ss', "columnCustom" = 'sss', "versionColumn" = "versionColumn" + 1, "updateColumn" = TO_TIMESTAMP('', 'YYYY-MM-DD HH24:MI:SS') WHERE "primaryGeneratedColumn" = 1`
      .replaceAll(/[ \n\t]+/ig, " ").trim();
  assertEquals(q2, qe2);

  const qs3 = db.update(UpdateEntity2)
    .set({
      primaryGeneratedColumn: 1,
      column2: "ss",
      column3: "sss",
      column4: "dont show columns",
    })
    .where([`"column2" = ''`, `OR "column2" IS NULL`]);
  let q3 = qs3.getQuery() || "";
  q3 = q3.replaceAll(/[ \n\t]+/ig, " ").trim();
  const qe3 =
    `UPDATE "schema"."UpdateEntity2" SET "column2" = 'ss', "columnCustom" = 'sss', "versionColumn" = "versionColumn" + 1, "updateColumn" = TO_TIMESTAMP('', 'YYYY-MM-DD HH24:MI:SS') WHERE "primaryGeneratedColumn" = 1 AND ( "column2" = '' OR "column2" IS NULL )`
      .replaceAll(/[ \n\t]+/ig, " ").trim();
  assertEquals(q3, qe3);
});
Deno.test("update [update with where] sql", () => {
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
Deno.test("update [update with schema] sql", () => {
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
