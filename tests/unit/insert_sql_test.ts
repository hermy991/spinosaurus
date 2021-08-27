import { getTestConnection } from "./tool/tool.ts";
import { Connection } from "spinosaurus/mod.ts";
import { assertEquals } from "deno/testing/asserts.ts";

const con1 = getTestConnection();

Deno.test("insert [insert] sql", () => {
  const db: Connection = new Connection(con1);
  const qs = db.insert(["User"])
    .values({ column1: "xx" });
  let query = qs.getSql() || "";
  query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
  const queryExpected = `INSERT INTO "User" ("column1") VALUES ('xx')`
    .replaceAll(/[ \n\t]+/ig, " ").trim();
  assertEquals(query, queryExpected);
});

Deno.test("insert [insert 'Entity'] sql", async () => {
  const { InsertEntity1, InsertEntity2, InsertEntity4, InsertEntity5 } =
    await import(
      "./playground/decorators/InsertEntity.ts"
    );
  const db: Connection = new Connection(con1);
  const qs1 = db.insert(InsertEntity1)
    .values({ column2: "xx", column3: "xxx", column4: "xxxx" });
  let q1 = qs1.getSql() || "";
  q1 = q1.replaceAll(/[ \n\t]+/ig, " ").trim();
  const qe1 =
    `INSERT INTO "InsertEntity1" ("column2", "column3") VALUES ('xx', 'xxx')`
      .replaceAll(/[ \n\t]+/ig, " ").trim();
  assertEquals(q1, qe1);

  const qs2 = db.insert(InsertEntity2)
    .values({ test1: "xx", column1: 1, column2: "xx" });
  let q2 = qs2.getSql() || "";
  q2 = q2.replaceAll(/[ \n\t]+/ig, " ").trim();
  const qe2 = ``.replaceAll(/[ \n\t]+/ig, " ").trim();
  assertEquals(q2, qe2);

  const qs3 = db.insert(InsertEntity4)
    .values([{ column1: 50 }, { column2: "xx" }, { column3: "xxx" }]);
  let q3 = qs3.getSql() || "";
  q3 = q3.replaceAll(/[ \n\t]+/ig, " ").trim();
  const qe3 =
    `INSERT INTO "InsertEntity3" ("column2", "column5", "column6") VALUES ('xx', now(), now());
  INSERT INTO "InsertEntity3" ("column3", "column5", "column6") VALUES ('xxx', now(), now())`
      .replaceAll(/[ \n\t]+/ig, " ").trim();
  assertEquals(q3, qe3);

  const qs4 = db.insert({
    entity: InsertEntity5,
    options: { autoInsert: false },
  })
    .values([{ column1: 50 }, { column2: "xx" }, { column3: "xxx" }]);
  let q4 = qs4.getSql() || "";
  q4 = q4.replaceAll(/[ \n\t]+/ig, " ").trim();
  const qe4 = `INSERT INTO "hello"."InsertEntity5" ("column2") VALUES ('xx');
INSERT INTO "hello"."InsertEntity5" ("column3") VALUES ('xxx')`
    .replaceAll(/[ \n\t]+/ig, " ").trim();
  assertEquals(q4, qe4);
});
Deno.test("insert [multiple insert] sql", () => {
  const db: Connection = new Connection(con1);
  const qs = db.insert(["User"])
    .values([{ column1: "x1" }, { column1: "x2" }]);
  let query = qs.getSql() || "";
  query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
  const queryExpected =
    `INSERT INTO "User" ("column1") VALUES ('x1'); INSERT INTO "User" ("column1") VALUES ('x2')`
      .replaceAll(/[ \n\t]+/ig, " ").trim();
  assertEquals(query, queryExpected);
});
Deno.test("insert [multiple insert with schema] sql", () => {
  const db: Connection = new Connection(con1);
  const qs = db.insert(["User", "public"])
    .values([{ column1: "x1" }, { column1: "x2" }]);
  let query = qs.getSql() || "";
  query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
  const queryExpected =
    `INSERT INTO "public"."User" ("column1") VALUES ('x1'); INSERT INTO "public"."User" ("column1") VALUES ('x2')`
      .replaceAll(/[ \n\t]+/ig, " ").trim();
  assertEquals(query, queryExpected);
});
