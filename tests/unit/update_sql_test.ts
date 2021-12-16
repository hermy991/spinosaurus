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
  const queryExpected = `UPDATE "User" SET "column1" = 'xx', "column2" = 'ss' RETURNING *`;
  assertEquals(query, queryExpected);
});

Deno.test("update [update by 'class'] sql", async () => {
  const { UpdateEntity1, UpdateEntity2, UpdateEntity6 } = await import("./playground/decorators/UpdateEntity.ts");
  const db: Connection = new Connection(con1);

  const updateColumn = new Date();
  const qs1 = db.update(UpdateEntity1)
    .set({ primaryColumn: 1, column2: "ss", column3: "sss", versionColumn: 2, updateColumn });
  const q1 = qs1.getSql();
  const qe1 =
    `UPDATE "schema"."UpdateEntityCustom" SET "column2" = 'ss', "columnCustom" = 'sss', "versionColumn" = 2, "updateColumn" = TO_TIMESTAMP('${
      luxon.DateTime.fromJSDate(updateColumn).toFormat("yyyy-MM-dd HH:mm:ss")
    }', 'YYYY-MM-DD HH24:MI:SS') WHERE "primaryColumn" = 1 RETURNING "primaryColumn"`;
  assertEquals(q1, qe1);

  const qs2 = db.update(UpdateEntity2)
    .set({ primaryGeneratedColumn: 1, column2: "ss", column3: "sss", column4: "dont show columns" });
  const q2 = qs2.getSql();
  const qe2 =
    `UPDATE "schema"."UpdateEntity2" SET "column2" = 'ss', "columnCustom" = 'sss', "versionColumn" = "versionColumn" + 1, "updateColumn" = now() WHERE "primaryGeneratedColumn" = 1 RETURNING "primaryGeneratedColumn"`;
  assertEquals(q2, qe2);

  const qs3 = db.update(UpdateEntity2)
    .set({ primaryGeneratedColumn: 1, column2: "ss", column3: "sss", column4: "dont show columns" })
    .where([`"column2" = ''`, `OR "column2" IS NULL`]);
  const q3 = qs3.getSql();
  const qe3 =
    `UPDATE "schema"."UpdateEntity2" SET "column2" = 'ss', "columnCustom" = 'sss', "versionColumn" = "versionColumn" + 1, "updateColumn" = now() WHERE "primaryGeneratedColumn" = 1 AND ( "column2" = '' OR "column2" IS NULL ) RETURNING "primaryGeneratedColumn"`;
  assertEquals(q3, qe3);

  const qs4 = db.update({ entity: UpdateEntity2, options: { autoUpdate: false } })
    .set({ primaryGeneratedColumn: 1, column2: "ss", column3: "sss", column4: "dont show columns" })
    .where([`"column2" = ''`, `OR "column2" IS NULL`]);
  const q4 = qs4.getSql();
  const qe4 =
    `UPDATE "schema"."UpdateEntity2" SET "column2" = 'ss', "columnCustom" = 'sss' WHERE "primaryGeneratedColumn" = 1 AND ( "column2" = '' OR "column2" IS NULL ) RETURNING "primaryGeneratedColumn"`;
  assertEquals(q4, qe4);

  const tentities = [{
    primaryColumn_ID: 1,
    updateEntity1: { primaryColumn: 1 },
    updateEntity2: { primaryGeneratedColumn: 2 },
    updateEntity4: { column1: 4 },
    updateEntityX1: { column1: 101 },
    updateEntityX2: { column1: 102 },
  }, {
    primaryColumn_ID: 2,
    updateEntity1: { primaryColumn: 6 },
    updateEntity2: { primaryGeneratedColumn: 7 },
    updateEntity4: { column1: 9 },
    updateEntityX1: { column1: 101 },
    updateEntityX2: { column1: 102 },
  }];
  const qs6 = db.update(UpdateEntity6).set(tentities);
  const q6 = qs6.getSql();
  const qe6 =
    `UPDATE "hello"."UpdateEntityCustom" SET "UpdateEntityCustom_primaryColumn" = 1, "UpdateEntity2_primaryGeneratedColumn" = 2, "columnPrimary_ID" = 4, "UpdateEntity5_column1" = 101, "UpdateEntity5_column1_2" = 102 WHERE "primaryColumn_ID" = 1 RETURNING "primaryColumn_ID";
UPDATE "hello"."UpdateEntityCustom" SET "UpdateEntityCustom_primaryColumn" = 6, "UpdateEntity2_primaryGeneratedColumn" = 7, "columnPrimary_ID" = 9, "UpdateEntity5_column1" = 101, "UpdateEntity5_column1_2" = 102 WHERE "primaryColumn_ID" = 2 RETURNING "primaryColumn_ID"`;
  assertEquals(q6, qe6);
});
Deno.test("update [update with where] sql", () => {
  const db: Connection = new Connection(con1);
  const qs = db.update(["User"]).set({ column1: "xx", column2: "ss" }).where([`"user_ID" = 5`]);
  const query = qs.getSql();
  const queryExpected = `UPDATE "User" SET "column1" = 'xx', "column2" = 'ss' WHERE "user_ID" = 5 RETURNING *`;
  assertEquals(query, queryExpected);
});
Deno.test("update [update with schema] sql", () => {
  const db: Connection = new Connection(con1);
  const qs = db.update(["User", "bill"]).set({ column1: "xx", column2: "ss" }).where([`"user_ID" = 5`]);
  const sql = qs.getSql();
  const queryExpected = `UPDATE "bill"."User" SET "column1" = 'xx', "column2" = 'ss' WHERE "user_ID" = 5 RETURNING *`;
  assertEquals(sql, queryExpected);
});
Deno.test("update [returning] sql", async () => {
  const { UpdateReturningEntity1 } = await import("./playground/decorators/UpdateReturningEntity.ts");
  const conOptsX = self.structuredClone(con1);
  const schema = "returning";
  const user1 = "User1";
  const db: Connection = new Connection(conOptsX);
  const ch2 = await db.checkObject({ name: user1, schema });
  if (ch2.exists) {
    await db.drop({ entity: user1, schema, check: true }).execute();
  }
  const ch1 = await db.checkSchema({ name: schema });
  if (ch1.exists) {
    await db.drop({ schema, check: true }).execute();
  }
  await db.create({ schema, check: true }).execute();
  await db.create({ entity: user1, schema })
    .columns([
      { name: "column1", spitype: "integer", primary: true, autoIncrement: "increment" },
      { name: "column2", spitype: "varchar", length: 100 },
      { name: "column3", spitype: "varchar", length: 100 },
    ]).execute();
  const values1 = [{ column2: "1_1", column3: "1_2" }, { column2: "2_1", column3: "2_2" }];
  await db.insert({ entity: user1, schema }).values(values1).returning("*").execute();
  const r1 = await db.update({ entity: user1, schema }).set(values1).returning("*").execute();

  const values2 = [{ column2: "3_1", column3: "3_2" }, { column2: "4_1", column3: "4_2" }];
  await db.insert({ entity: user1, schema }).values(values2).returning("column1").execute();
  const r2 = await db.update({ entity: user1, schema }).set(values2).returning("column1").execute();

  const values3 = [{ column2: "5_1", column3: "5_2" }, { column2: "6_1", column3: "6_2" }];
  await db.insert({ entity: user1, schema }).values(values3).execute();
  const r3 = await db.update({ entity: user1, schema }).set(values3).execute();

  const values4 = [{ column2: "7_1", column3: "7_2" }, { column2: "8_1", column3: "8_2" }];
  await db.insert(UpdateReturningEntity1).values(values4).execute();
  const r4 = await db.update(UpdateReturningEntity1).set(values4).execute();

  await db.drop({ entity: user1, schema }).execute();
  await db.drop({ schema, check: true }).execute();
  assertEquals(
    r1.rows,
    [
      { column1: 1, column2: "1_1", column3: "1_2" },
      { column1: 2, column2: "1_1", column3: "1_2" },
      { column1: 1, column2: "2_1", column3: "2_2" },
      { column1: 2, column2: "2_1", column3: "2_2" },
    ],
  );
  assertEquals(r2.rows, [
    { column1: 1 },
    { column1: 2 },
    { column1: 3 },
    { column1: 4 },
    { column1: 1 },
    { column1: 2 },
    { column1: 3 },
    { column1: 4 },
  ]);
  assertEquals(r3.rows, [
    { column1: 1, column2: "5_1", column3: "5_2" },
    { column1: 2, column2: "5_1", column3: "5_2" },
    { column1: 3, column2: "5_1", column3: "5_2" },
    { column1: 4, column2: "5_1", column3: "5_2" },
    { column1: 5, column2: "5_1", column3: "5_2" },
    { column1: 6, column2: "5_1", column3: "5_2" },
    { column1: 1, column2: "6_1", column3: "6_2" },
    { column1: 2, column2: "6_1", column3: "6_2" },
    { column1: 3, column2: "6_1", column3: "6_2" },
    { column1: 4, column2: "6_1", column3: "6_2" },
    { column1: 5, column2: "6_1", column3: "6_2" },
    { column1: 6, column2: "6_1", column3: "6_2" },
  ]);
  assertEquals(r4.rows, [{ column1: 7 }, { column1: 8 }]);
  assertEquals(
    values4,
    [{ column1: 7, column2: "7_1", column3: "7_2" }, { column1: 8, column2: "8_1", column3: "8_2" }],
  );
});
