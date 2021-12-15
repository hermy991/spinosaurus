import { clearPlayground, getTestConnection } from "./tool/tool.ts";
import { Connection } from "spinosaurus/mod.ts";
import { assertEquals } from "deno/testing/asserts.ts";

const con1 = getTestConnection();

Deno.test("insert [insert] sql", () => {
  const db: Connection = new Connection(con1);
  const qs = db.insert(["User"]).values({ column1: "xx" });
  const query = qs.getSql();
  const queryExpected = `INSERT INTO "User" ("column1") VALUES ('xx')`;
  assertEquals(query, queryExpected);
});

Deno.test("insert [insert by 'class'] sql", async () => {
  const { InsertEntity1, InsertEntity2, InsertEntity4, InsertEntity5, InsertEntity6 } = await import(
    "./playground/decorators/InsertEntity.ts"
  );
  const db: Connection = new Connection(con1);
  const qs1 = db.insert(InsertEntity1).values({ column2: "xx", column3: "xxx", column4: "xxxx" });
  const q1 = qs1.getSql();
  const qe1 = `INSERT INTO "InsertEntity1" ("column2", "column3") VALUES ('xx', 'xxx')`;
  assertEquals(q1, qe1);

  const qs2 = db.insert(InsertEntity2).values({ test1: "xx", column1: 1, column2: "xx" });
  const q2 = qs2.getSql();
  const qe2 = ``;
  assertEquals(q2, qe2);

  const qs3 = db.insert(InsertEntity4).values([{ column1: 50 }, { column2: "xx" }, { column3: "xxx" }]);
  const q3 = qs3.getSql();
  const qe3 = `INSERT INTO "InsertEntity3" ("column2", "column5", "column6") VALUES ('xx', now(), now());
INSERT INTO "InsertEntity3" ("column3", "column5", "column6") VALUES ('xxx', now(), now())`;
  assertEquals(q3, qe3);

  const qs4 = db.insert({ entity: InsertEntity5, options: { autoInsert: false } })
    .values([{ column1: 50 }, { column2: "xx" }, { column3: "xxx" }]);
  const q4 = qs4.getSql();
  const qe4 = `INSERT INTO "hello"."InsertEntity5" ("column2") VALUES ('xx');
INSERT INTO "hello"."InsertEntity5" ("column3") VALUES ('xxx')`;
  assertEquals(q4, qe4);

  const qs5 = db.insert({ entity: InsertEntity2, options: { autoGeneratePrimaryKey: false } })
    .values({ test1: "xx", column1: 1, column2: "xx" });
  const q5 = qs5.getSql();
  const qe5 = `INSERT INTO "InsertEntity2" ("column1", "column2") VALUES (1, 'xx')`;
  assertEquals(q5, qe5);

  const tentities = [{
    primaryColumn_ID: 1,
    insertEntity1: { column1: 1 },
    insertEntity2: { column1: 2 },
    insertEntity4: { column1: 4 },
    insertEntityX1: { column1: 101 },
    insertEntityX2: { column1: 102 },
  }, {
    primaryColumn_ID: 2,
    insertEntity1: { column1: 6 },
    insertEntity2: { column1: 7 },
    insertEntity4: { column1: 9 },
    insertEntityX1: { column1: 101 },
    insertEntityX2: { column1: 102 },
  }];
  const qs6 = db.insert({ entity: InsertEntity6, options: { autoGeneratePrimaryKey: false } }).values(tentities);
  const q6 = qs6.getSql();
  const qe6 =
    `INSERT INTO "hello"."InsertEntityCustom" ("primaryColumn_ID", "InsertEntity1_primaryColumn_ID", "InsertEntity2_column1", "columnPrimary_ID", "InsertEntity5_column1", "InsertEntity5_column1_2") VALUES (1, 1, 2, 4, 101, 102);
INSERT INTO "hello"."InsertEntityCustom" ("primaryColumn_ID", "InsertEntity1_primaryColumn_ID", "InsertEntity2_column1", "columnPrimary_ID", "InsertEntity5_column1", "InsertEntity5_column1_2") VALUES (2, 6, 7, 9, 101, 102)`;
  assertEquals(q6, qe6);
});
Deno.test("insert [multiple insert] sql", () => {
  const db: Connection = new Connection(con1);
  const qs = db.insert(["User"]).values([{ column1: "x1" }, { column1: "x2" }]);
  const query = qs.getSql();
  const queryExpected = `INSERT INTO "User" ("column1") VALUES ('x1');
INSERT INTO "User" ("column1") VALUES ('x2')`;
  assertEquals(query, queryExpected);
});
Deno.test("insert [multiple insert with schema] sql", () => {
  const db: Connection = new Connection(con1);
  const qs = db.insert(["User", "public"]).values([{ column1: "x1" }, { column1: "x2" }]);
  const query = qs.getSql();
  const queryExpected = `INSERT INTO "public"."User" ("column1") VALUES ('x1');
INSERT INTO "public"."User" ("column1") VALUES ('x2')`;
  assertEquals(query, queryExpected);
});
Deno.test("insert [returning] sql", async () => {
  const conOptsX = self.structuredClone(con1);
  const schema = "returning";
  const user1 = "User1";
  const db: Connection = new Connection(conOptsX);
  const ch1 = await db.checkSchema({ name: schema });
  if (ch1.exists) {
    await db.drop({ schema, check: true }).execute();
  }
  const ch2 = await db.checkObject({ name: user1, schema });
  if (ch2.exists) {
    await db.drop({ entity: user1, schema, check: true }).execute();
  }
  await db.create({ schema, check: true }).execute();
  await db.create({ entity: user1, schema })
    .columns([
      { name: "column1", spitype: "integer", primary: true, autoIncrement: "increment" },
      { name: "column2", spitype: "varchar", length: 100 },
      { name: "column3", spitype: "varchar", length: 100 },
    ])
    .execute();
  const values1 = [
    { column2: "Test_1_1", column3: "Test_1_2" },
    { column2: "Test_2_2", column3: "Test_2_2" },
  ];
  const r1 = await db.insert({ entity: user1, schema }).values(values1).returning("*").execute();
  console.log("r1 = ", r1);
  const values2 = [
    { column2: "Test_3_1", column3: "Test_3_2" },
    { column2: "Test_4_2", column3: "Test_4_2" },
  ];
  const r2 = await db.insert({ entity: user1, schema }).values(values2).returning("column1").execute();
  console.log("r2 = ", r2);
  await db.drop({ entity: user1, schema }).execute();
  await db.drop({ schema, check: true }).execute();
});
