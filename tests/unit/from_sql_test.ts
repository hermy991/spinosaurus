import { getTestConnection } from "./tool/tool.ts";
import { Connection } from "spinosaurus/mod.ts";
import { assertEquals } from "deno/testing/asserts.ts";

const con1 = getTestConnection();

Deno.test("from [from Connection] sql", async () => {
  const { SelectEntity1 /*, SelectEntity2, SelectEntity5*/ } = await import("./playground/decorators/SelectEntity.ts");
  const db: Connection = new Connection(con1);

  const qs1 = db.from(SelectEntity1);
  const q1 = qs1.getSql();
  const qe1 =
    `SELECT "SelectEntityCustom"."test1" "test1", "SelectEntityCustom"."test2" "test2", "SelectEntityCustom"."custom" "custom" FROM "SelectEntityCustom"`;
  assertEquals(q1, qe1);

  const qs2 = db.from(SelectEntity1, "u");
  const q2 = qs2.getSql();
  const qe2 = `SELECT "u"."test1" "test1", "u"."test2" "test2", "u"."custom" "custom" FROM "SelectEntityCustom" AS "u"`;
  assertEquals(q2, qe2);

  const qs3 = db.from("test.Hello");
  const q3 = qs3.getSql();
  const qe3 = `SELECT "test"."Hello".* FROM "test"."Hello"`;
  assertEquals(q3, qe3);

  const qs4 = db.from("test.Hello", "u");
  const q4 = qs4.getSql();
  const qe4 = `SELECT "u".* FROM "test"."Hello" AS "u"`;
  assertEquals(q4, qe4);

  const qs5 = db.from(db.from(SelectEntity1));
  const q5 = qs5.getSql();
  const qe5 =
    `SELECT "_1".* FROM ( SELECT "SelectEntityCustom"."test1" "test1", "SelectEntityCustom"."test2" "test2", "SelectEntityCustom"."custom" "custom" FROM "SelectEntityCustom" ) AS "_1"`;
  assertEquals(q5, qe5);

  const qs6 = db.from(db.from(SelectEntity1), "u");
  const q6 = qs6.getSql();
  const qe6 =
    `SELECT "u".* FROM ( SELECT "SelectEntityCustom"."test1" "test1", "SelectEntityCustom"."test2" "test2", "SelectEntityCustom"."custom" "custom" FROM "SelectEntityCustom" ) AS "u"`;
  assertEquals(q6, qe6);

  const qs7 = db.from({ entity: SelectEntity1 });
  const q7 = qs7.getSql();
  const qe7 =
    `SELECT "SelectEntityCustom"."test1" "test1", "SelectEntityCustom"."test2" "test2", "SelectEntityCustom"."custom" "custom" FROM "SelectEntityCustom"`;
  assertEquals(q7, qe7);

  const qs8 = db.from({ entity: SelectEntity1, as: "u" });
  const q8 = qs8.getSql();
  const qe8 = `SELECT "u"."test1" "test1", "u"."test2" "test2", "u"."custom" "custom" FROM "SelectEntityCustom" AS "u"`;
  assertEquals(q8, qe8);

  const qs9 = db.from({ entity: "test.Hello" });
  const q9 = qs9.getSql();
  const qe9 = `SELECT "test"."Hello".* FROM "test"."Hello"`;
  assertEquals(q9, qe9);

  const qs10 = db.from({ entity: "test.Hello", as: "u" });
  const q10 = qs10.getSql();
  const qe10 = `SELECT "u".* FROM "test"."Hello" AS "u"`;
  assertEquals(q10, qe10);

  const qs11 = db.from({ entity: db.from(SelectEntity1) });
  const q11 = qs11.getSql();
  const qe11 =
    `SELECT "_1".* FROM ( SELECT "SelectEntityCustom"."test1" "test1", "SelectEntityCustom"."test2" "test2", "SelectEntityCustom"."custom" "custom" FROM "SelectEntityCustom" ) AS "_1"`;
  assertEquals(q11, qe11);

  const qs12 = db.from({ entity: db.from(SelectEntity1), as: "u" });
  const q12 = qs12.getSql();
  const qe12 =
    `SELECT "u".* FROM ( SELECT "SelectEntityCustom"."test1" "test1", "SelectEntityCustom"."test2" "test2", "SelectEntityCustom"."custom" "custom" FROM "SelectEntityCustom" ) AS "u"`;
  assertEquals(q12, qe12);
});

Deno.test("from [from ExecutorSelect] sql", async () => {
  const { SelectEntity1 /*, SelectEntity2, SelectEntity5*/ } = await import("./playground/decorators/SelectEntity.ts");
  const db: Connection = new Connection(con1);

  const qs1 = db.select().from(SelectEntity1);
  const q1 = qs1.getSql();
  const qe1 =
    `SELECT "SelectEntityCustom"."test1" "test1", "SelectEntityCustom"."test2" "test2", "SelectEntityCustom"."custom" "custom" FROM "SelectEntityCustom"`;
  assertEquals(q1, qe1);

  const qs2 = db.select().from(SelectEntity1, "u");
  const q2 = qs2.getSql();
  const qe2 = `SELECT "u"."test1" "test1", "u"."test2" "test2", "u"."custom" "custom" FROM "SelectEntityCustom" AS "u"`;
  assertEquals(q2, qe2);

  const qs3 = db.select().from("test.Hello");
  const q3 = qs3.getSql();
  const qe3 = `SELECT "test"."Hello".* FROM "test"."Hello"`;
  assertEquals(q3, qe3);

  const qs4 = db.select().from("test.Hello", "u");
  const q4 = qs4.getSql();
  const qe4 = `SELECT "u".* FROM "test"."Hello" AS "u"`;
  assertEquals(q4, qe4);

  const qs5 = db.select().from(db.select().from(SelectEntity1));
  const q5 = qs5.getSql();
  const qe5 =
    `SELECT "_1".* FROM ( SELECT "SelectEntityCustom"."test1" "test1", "SelectEntityCustom"."test2" "test2", "SelectEntityCustom"."custom" "custom" FROM "SelectEntityCustom" ) AS "_1"`;
  assertEquals(q5, qe5);

  const qs6 = db.select().from(db.select().from(SelectEntity1), "u");
  const q6 = qs6.getSql();
  const qe6 =
    `SELECT "u".* FROM ( SELECT "SelectEntityCustom"."test1" "test1", "SelectEntityCustom"."test2" "test2", "SelectEntityCustom"."custom" "custom" FROM "SelectEntityCustom" ) AS "u"`;
  assertEquals(q6, qe6);

  const qs7 = db.select().from({ entity: SelectEntity1 });
  const q7 = qs7.getSql();
  const qe7 =
    `SELECT "SelectEntityCustom"."test1" "test1", "SelectEntityCustom"."test2" "test2", "SelectEntityCustom"."custom" "custom" FROM "SelectEntityCustom"`;
  assertEquals(q7, qe7);

  const qs8 = db.select().from({ entity: SelectEntity1, as: "u" });
  const q8 = qs8.getSql();
  const qe8 = `SELECT "u"."test1" "test1", "u"."test2" "test2", "u"."custom" "custom" FROM "SelectEntityCustom" AS "u"`;
  assertEquals(q8, qe8);

  const qs9 = db.select().from({ entity: "test.Hello" });
  const q9 = qs9.getSql();
  const qe9 = `SELECT "test"."Hello".* FROM "test"."Hello"`;
  assertEquals(q9, qe9);

  const qs10 = db.select().from({ entity: "test.Hello", as: "u" });
  const q10 = qs10.getSql();
  const qe10 = `SELECT "u".* FROM "test"."Hello" AS "u"`;
  assertEquals(q10, qe10);

  const qs11 = db.select().from({ entity: db.select().from(SelectEntity1) });
  const q11 = qs11.getSql();
  const qe11 =
    `SELECT "_1".* FROM ( SELECT "SelectEntityCustom"."test1" "test1", "SelectEntityCustom"."test2" "test2", "SelectEntityCustom"."custom" "custom" FROM "SelectEntityCustom" ) AS "_1"`;
  assertEquals(q11, qe11);

  const qs12 = db.select().from({ entity: db.select().from(SelectEntity1), as: "u" });
  const q12 = qs12.getSql();
  const qe12 =
    `SELECT "u".* FROM ( SELECT "SelectEntityCustom"."test1" "test1", "SelectEntityCustom"."test2" "test2", "SelectEntityCustom"."custom" "custom" FROM "SelectEntityCustom" ) AS "u"`;
  assertEquals(q12, qe12);
});
