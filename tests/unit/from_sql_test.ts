import { getTestConnection } from "./tool/tool.ts";
import { Connection } from "spinosaurus/mod.ts";
import { assertEquals } from "deno/testing/asserts.ts";

const con1 = getTestConnection();

Deno.test("from [from Connection] sql", async () => {
  const { SelectEntity1 /*, SelectEntity2, SelectEntity5*/ } = await import("./playground/decorators/SelectEntity.ts");
  const db: Connection = new Connection(con1);

  const qs1 = db.from(db.from(SelectEntity1));
  const q1 = qs1.getSql();
  const qe1 =
    `SELECT "_1".* FROM ( SELECT "SelectEntityCustom"."test1" "test1", "SelectEntityCustom"."test2" "test2", "SelectEntityCustom"."custom" "custom" FROM "SelectEntityCustom" ) AS "_1"`;
  assertEquals(q1, qe1);

  const qs2 = db.from(db.from(SelectEntity1), "u");
  const q2 = qs2.getSql();
  const qe2 =
    `SELECT "u".* FROM ( SELECT "SelectEntityCustom"."test1" "test1", "SelectEntityCustom"."test2" "test2", "SelectEntityCustom"."custom" "custom" FROM "SelectEntityCustom" ) AS "u"`;
  assertEquals(q2, qe2);
});

Deno.test("from [from ExecutorSelect] sql", async () => {
  const { SelectEntity1 /*, SelectEntity2, SelectEntity5*/ } = await import("./playground/decorators/SelectEntity.ts");
  const db: Connection = new Connection(con1);

  const qs1 = db.select().from(db.select().from(SelectEntity1));
  const q1 = qs1.getSql();
  const qe1 =
    `SELECT "_1".* FROM ( SELECT "SelectEntityCustom"."test1" "test1", "SelectEntityCustom"."test2" "test2", "SelectEntityCustom"."custom" "custom" FROM "SelectEntityCustom" ) AS "_1"`;
  assertEquals(q1, qe1);

  const qs2 = db.select().from(db.select().from(SelectEntity1), "u");
  const q2 = qs2.getSql();
  const qe2 =
    `SELECT "u".* FROM ( SELECT "SelectEntityCustom"."test1" "test1", "SelectEntityCustom"."test2" "test2", "SelectEntityCustom"."custom" "custom" FROM "SelectEntityCustom" ) AS "u"`;
  assertEquals(q2, qe2);
});
