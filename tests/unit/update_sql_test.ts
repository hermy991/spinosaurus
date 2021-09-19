import { getTestConnection } from "./tool/tool.ts";
import { Connection } from "spinosaurus/mod.ts";
import { assertEquals } from "deno/testing/asserts.ts";
import * as luxon from "luxon/mod.ts";

const con1 = getTestConnection();

Deno.test("update [update] sql", () => {
  const db: Connection = new Connection(con1);
  const qs = db.update(["User"])
    .set({ column1: "xx", column2: "ss" });
  const query = qs.getSql();
  const queryExpected = `UPDATE "User" SET "column1" = 'xx', "column2" = 'ss'`;
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
  const q1 = qs1.getSql();
  const qe1 =
    `UPDATE "schema"."UpdateEntityCustom" SET "column2" = 'ss', "columnCustom" = 'sss', "versionColumn" = 2, "updateColumn" = TO_TIMESTAMP('${
      luxon.DateTime.fromJSDate(updateColumn).toFormat("yyyy-MM-dd HH:mm:ss")
    }', 'YYYY-MM-DD HH24:MI:SS') WHERE "primaryColumn" = 1`;
  assertEquals(q1, qe1);

  const qs2 = db.update(UpdateEntity2)
    .set({
      primaryGeneratedColumn: 1,
      column2: "ss",
      column3: "sss",
      column4: "dont show columns",
    });
  const q2 = qs2.getSql();
  const qe2 =
    `UPDATE "schema"."UpdateEntity2" SET "column2" = 'ss', "columnCustom" = 'sss', "versionColumn" = "versionColumn" + 1, "updateColumn" = now() WHERE "primaryGeneratedColumn" = 1`;
  assertEquals(q2, qe2);

  const qs3 = db.update(UpdateEntity2)
    .set({
      primaryGeneratedColumn: 1,
      column2: "ss",
      column3: "sss",
      column4: "dont show columns",
    })
    .where([`"column2" = ''`, `OR "column2" IS NULL`]);
  const q3 = qs3.getSql();
  const qe3 =
    `UPDATE "schema"."UpdateEntity2" SET "column2" = 'ss', "columnCustom" = 'sss', "versionColumn" = "versionColumn" + 1, "updateColumn" = now() WHERE "primaryGeneratedColumn" = 1 AND ( "column2" = '' OR "column2" IS NULL )`;
  assertEquals(q3, qe3);
  const qs4 = db.update({
    entity: UpdateEntity2,
    options: { autoUpdate: false },
  })
    .set({
      primaryGeneratedColumn: 1,
      column2: "ss",
      column3: "sss",
      column4: "dont show columns",
    })
    .where([`"column2" = ''`, `OR "column2" IS NULL`]);
  const q4 = qs4.getSql();
  const qe4 =
    `UPDATE "schema"."UpdateEntity2" SET "column2" = 'ss', "columnCustom" = 'sss' WHERE "primaryGeneratedColumn" = 1 AND ( "column2" = '' OR "column2" IS NULL )`;
  assertEquals(q4, qe4);
});
Deno.test("update [update with where] sql", () => {
  const db: Connection = new Connection(con1);
  const qs = db.update(["User"])
    .set({ column1: "xx", column2: "ss" })
    .where([`"user_ID" = 5`]);
  const query = qs.getSql();
  const queryExpected = `UPDATE "User" SET "column1" = 'xx', "column2" = 'ss' WHERE "user_ID" = 5`;
  assertEquals(query, queryExpected);
});
Deno.test("update [update with schema] sql", () => {
  const db: Connection = new Connection(con1);
  const qs = db.update(["User", "bill"])
    .set({ column1: "xx", column2: "ss" })
    .where([`"user_ID" = 5`]);
  const sql = qs.getSql();
  const queryExpected = `UPDATE "bill"."User" SET "column1" = 'xx', "column2" = 'ss' WHERE "user_ID" = 5`;
  assertEquals(sql, queryExpected);
});
