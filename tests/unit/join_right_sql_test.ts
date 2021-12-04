import { getTestConnection } from "./tool/tool.ts";
import { Connection } from "spinosaurus/mod.ts";
import { assertEquals } from "deno/testing/asserts.ts";

const con1 = getTestConnection();

Deno.test("right join [right] sql", async () => {
  const { FromEntity1 } = await import("./playground/decorators/FromEntity.ts");
  const db: Connection = new Connection(con1);
  //Right Join Testing
  const qs1 = db.select().from({ entity: FromEntity1, as: "u1" })
    .right({ entity: "FromEntity2", on: `"FromEntity2"."columnKey1" = "u1"."columnKey1"` });
  const q1 = qs1.getSql();
  const qe1 =
    `SELECT "u1"."test1" "test1" FROM "FromEntity1" AS "u1" RIGHT JOIN "FromEntity2" ON "FromEntity2"."columnKey1" = "u1"."columnKey1"`;
  assertEquals(q1, qe1);

  const qs2 = db.select().from({ entity: FromEntity1, as: "u1" })
    .right({ entity: "FromEntity2", as: "u2", on: `"u2"."columnKey1" = "u1"."columnKey1"` });
  const q2 = qs2.getSql();
  const qe2 =
    `SELECT "u1"."test1" "test1" FROM "FromEntity1" AS "u1" RIGHT JOIN "FromEntity2" AS "u2" ON "u2"."columnKey1" = "u1"."columnKey1"`;
  assertEquals(q2, qe2);

  const qs3 = db.select().from({ entity: FromEntity1, as: "u1" })
    .right({
      schema: "example",
      entity: "FromEntity2",
      on: `"example"."FromEntity2"."columnKey1" = "u1"."columnKey1"`,
    });
  const q3 = qs3.getSql();
  const qe3 =
    `SELECT "u1"."test1" "test1" FROM "FromEntity1" AS "u1" RIGHT JOIN "example"."FromEntity2" ON "example"."FromEntity2"."columnKey1" = "u1"."columnKey1"`;
  assertEquals(q3, qe3);

  /** new param structure */

  const qs4 = db.from({ entity: FromEntity1, as: "u1" })
    .right(`User`, `"User"."columnKey1" = "FromEntity1"."columnKey1"`);
  const q4 = qs4.getSql();
  const qe4 =
    `SELECT "u1"."test1" "test1" FROM "FromEntity1" AS "u1" RIGHT JOIN "User" ON "User"."columnKey1" = "FromEntity1"."columnKey1"`;
  assertEquals(q4, qe4);

  const qs5 = db.from({ entity: FromEntity1, as: "u1" })
    .right(`User`, `u`, `"u"."columnKey1" = "FromEntity1"."columnKey1"`);
  const q5 = qs5.getSql();
  const qe5 =
    `SELECT "u1"."test1" "test1" FROM "FromEntity1" AS "u1" RIGHT JOIN "User" AS "u" ON "u"."columnKey1" = "FromEntity1"."columnKey1"`;
  assertEquals(q5, qe5);

  const qs6 = db.from({ entity: FromEntity1, as: "u1" })
    .right(`hello.User`, `"hello"."User"."columnKey1" = "FromEntity1"."columnKey1"`);
  const q6 = qs6.getSql();
  const qe6 =
    `SELECT "u1"."test1" "test1" FROM "FromEntity1" AS "u1" RIGHT JOIN "hello"."User" ON "hello"."User"."columnKey1" = "FromEntity1"."columnKey1"`;
  assertEquals(q6, qe6);

  const qs7 = db.from({ entity: FromEntity1, as: "u1" })
    .right(`hello.User`, `u`, `"u"."columnKey1" = "FromEntity1"."columnKey1"`);
  const q7 = qs7.getSql();
  const qe7 =
    `SELECT "u1"."test1" "test1" FROM "FromEntity1" AS "u1" RIGHT JOIN "hello"."User" AS "u" ON "u"."columnKey1" = "FromEntity1"."columnKey1"`;
  assertEquals(q7, qe7);
});
Deno.test("right join [right by 'class'] sql", async () => {
  const { FromEntity1, FromEntity2, FromEntity5 } = await import("./playground/decorators/FromEntity.ts");
  const db: Connection = new Connection(con1);
  //Inner Join Testing
  const qs1 = db.select().from({ entity: FromEntity1, as: "u1" })
    .right({ entity: FromEntity2, on: `"FromEntity2"."columnKey1" = "u1"."columnKey1"` });
  const q1 = qs1.getSql();
  const qe1 =
    `SELECT "u1"."test1" "test1" FROM "FromEntity1" AS "u1" RIGHT JOIN "FromEntity2" ON "FromEntity2"."columnKey1" = "u1"."columnKey1"`;
  assertEquals(q1, qe1);

  const qs2 = db.select().from({ entity: FromEntity1, as: "u1" })
    .right({ entity: FromEntity2, as: "u2", on: `"u2"."columnKey1" = "u1"."columnKey1"` });
  const q2 = qs2.getSql();
  const qe2 =
    `SELECT "u1"."test1" "test1" FROM "FromEntity1" AS "u1" RIGHT JOIN "FromEntity2" AS "u2" ON "u2"."columnKey1" = "u1"."columnKey1"`;
  assertEquals(q2, qe2);

  const qs3 = db.select().from({ entity: FromEntity1, as: "u1" })
    .right({
      entity: FromEntity5,
      on: `"hello"."FromEntity5"."columnKey1" = "u1"."columnKey1"`,
    });
  const q3 = qs3.getSql();
  const qe3 =
    `SELECT "u1"."test1" "test1" FROM "FromEntity1" AS "u1" RIGHT JOIN "hello"."FromEntity5" ON "hello"."FromEntity5"."columnKey1" = "u1"."columnKey1"`;
  assertEquals(q3, qe3);

  const qs4 = db.select().from({ entity: FromEntity1, as: "u1" })
    .right({ entity: FromEntity5, as: "u5", on: `"u5"."columnKey1" = "u1"."columnKey1"` });
  const q4 = qs4.getSql();
  const qe4 =
    `SELECT "u1"."test1" "test1" FROM "FromEntity1" AS "u1" RIGHT JOIN "hello"."FromEntity5" AS "u5" ON "u5"."columnKey1" = "u1"."columnKey1"`;
  assertEquals(q4, qe4);

  /** new param structure */
  const qs5 = db.from({ entity: FromEntity1, as: "u1" })
    .right(FromEntity2, `"FromEntity2"."columnKey1" = "u1"."columnKey1"`);
  const q5 = qs5.getSql();
  const qe5 =
    `SELECT "u1"."test1" "test1" FROM "FromEntity1" AS "u1" RIGHT JOIN "FromEntity2" ON "FromEntity2"."columnKey1" = "u1"."columnKey1"`;
  assertEquals(q5, qe5);

  const qs6 = db.from({ entity: FromEntity1, as: "u1" })
    .right(FromEntity2, `"FromEntity2"."columnKey1" = "u1"."columnKey1" AND "u1"."columnKey1" = :key`, { key: "xx" });
  const q6 = qs6.getSql();
  const qe6 =
    `SELECT "u1"."test1" "test1" FROM "FromEntity1" AS "u1" RIGHT JOIN "FromEntity2" ON "FromEntity2"."columnKey1" = "u1"."columnKey1" AND "u1"."columnKey1" = 'xx'`;
  assertEquals(q6, qe6);

  const qs7 = db.from({ entity: FromEntity1, as: "u1" })
    .right(FromEntity2, "u", `"u"."columnKey1" = "u1"."columnKey1"`);
  const q7 = qs7.getSql();
  const qe7 =
    `SELECT "u1"."test1" "test1" FROM "FromEntity1" AS "u1" RIGHT JOIN "FromEntity2" AS "u" ON "u"."columnKey1" = "u1"."columnKey1"`;
  assertEquals(q7, qe7);

  const qs8 = db.from({ entity: FromEntity1, as: "u1" })
    .right(FromEntity2, "u", `"u"."columnKey1" = "u1"."columnKey1" AND "u1"."columnKey1" = :key`, { key: "xx" });
  const q8 = qs8.getSql();
  const qe8 =
    `SELECT "u1"."test1" "test1" FROM "FromEntity1" AS "u1" RIGHT JOIN "FromEntity2" AS "u" ON "u"."columnKey1" = "u1"."columnKey1" AND "u1"."columnKey1" = 'xx'`;
  assertEquals(q8, qe8);
});
Deno.test("right join [right by 'sub-query'] sql", async () => {
  const { FromEntity1 } = await import("./playground/decorators/FromEntity.ts");
  const db: Connection = new Connection(con1);

  const qs7 = db.from(FromEntity1, "u1")
    .right(db.from(FromEntity1), `"_2"."test1" = "u1"."test1"`);
  const q7 = qs7.getSql();
  const qe7 =
    `SELECT "u1"."test1" "test1" FROM "FromEntity1" AS "u1" RIGHT JOIN ( SELECT "FromEntity1"."test1" "test1" FROM "FromEntity1" ) AS "_2" ON "_2"."test1" = "u1"."test1"`;
  assertEquals(q7, qe7);

  const qs8 = db.from(FromEntity1, "u1")
    .right(db.from(FromEntity1), `u2`, `"u2"."test1" = "u1"."test1"`);
  const q8 = qs8.getSql();
  const qe8 =
    `SELECT "u1"."test1" "test1" FROM "FromEntity1" AS "u1" RIGHT JOIN ( SELECT "FromEntity1"."test1" "test1" FROM "FromEntity1" ) AS "u2" ON "u2"."test1" = "u1"."test1"`;
  assertEquals(q8, qe8);
});
Deno.test("right join [select right] sql", async () => {
  const { FromEntity1 } = await import("./playground/decorators/FromEntity.ts");
  const db: Connection = new Connection(con1);
  //Right Join Testing
  const qs1 = db.select().from({ entity: FromEntity1, as: "u1" })
    .rightAndSelect({ entity: "FromEntity2", on: `"FromEntity2"."columnKey1" = "u1"."columnKey1"` });
  const q1 = qs1.getSql();
  const qe1 =
    `SELECT "u1"."test1" "test1", "FromEntity2".* FROM "FromEntity1" AS "u1" RIGHT JOIN "FromEntity2" ON "FromEntity2"."columnKey1" = "u1"."columnKey1"`;
  assertEquals(q1, qe1);

  const qs2 = db.select().from({ entity: FromEntity1, as: "u1" })
    .rightAndSelect({ entity: "FromEntity2", as: "u2", on: `"u2"."columnKey1" = "u1"."columnKey1"` });
  const q2 = qs2.getSql();
  const qe2 =
    `SELECT "u1"."test1" "test1", "u2".* FROM "FromEntity1" AS "u1" RIGHT JOIN "FromEntity2" AS "u2" ON "u2"."columnKey1" = "u1"."columnKey1"`;
  assertEquals(q2, qe2);

  const qs3 = db.select().from({ entity: FromEntity1, as: "u1" })
    .rightAndSelect({
      schema: "example",
      entity: "FromEntity2",
      on: `"example"."FromEntity2"."columnKey1" = "u1"."columnKey1"`,
    });
  const q3 = qs3.getSql();
  const qe3 =
    `SELECT "u1"."test1" "test1", "example"."FromEntity2".* FROM "FromEntity1" AS "u1" RIGHT JOIN "example"."FromEntity2" ON "example"."FromEntity2"."columnKey1" = "u1"."columnKey1"`;
  assertEquals(q3, qe3);

  /** new param structure */

  const qs4 = db.from({ entity: FromEntity1, as: "u1" })
    .rightAndSelect(`User`, `"User"."columnKey1" = "FromEntity1"."columnKey1"`);
  const q4 = qs4.getSql();
  const qe4 =
    `SELECT "u1"."test1" "test1", "User".* FROM "FromEntity1" AS "u1" RIGHT JOIN "User" ON "User"."columnKey1" = "FromEntity1"."columnKey1"`;
  assertEquals(q4, qe4);

  const qs5 = db.from({ entity: FromEntity1, as: "u1" })
    .rightAndSelect(`User`, `u`, `"u"."columnKey1" = "FromEntity1"."columnKey1"`);
  const q5 = qs5.getSql();
  const qe5 =
    `SELECT "u1"."test1" "test1", "u".* FROM "FromEntity1" AS "u1" RIGHT JOIN "User" AS "u" ON "u"."columnKey1" = "FromEntity1"."columnKey1"`;
  assertEquals(q5, qe5);

  const qs6 = db.from({ entity: FromEntity1, as: "u1" })
    .rightAndSelect(`hello.User`, `"hello"."User"."columnKey1" = "FromEntity1"."columnKey1"`);
  const q6 = qs6.getSql();
  const qe6 =
    `SELECT "u1"."test1" "test1", "hello"."User".* FROM "FromEntity1" AS "u1" RIGHT JOIN "hello"."User" ON "hello"."User"."columnKey1" = "FromEntity1"."columnKey1"`;
  assertEquals(q6, qe6);

  const qs7 = db.from({ entity: FromEntity1, as: "u1" })
    .rightAndSelect(`hello.User`, `u`, `"u"."columnKey1" = "FromEntity1"."columnKey1"`);
  const q7 = qs7.getSql();
  const qe7 =
    `SELECT "u1"."test1" "test1", "u".* FROM "FromEntity1" AS "u1" RIGHT JOIN "hello"."User" AS "u" ON "u"."columnKey1" = "FromEntity1"."columnKey1"`;
  assertEquals(q7, qe7);
});
Deno.test("right join [select right by 'class'] sql", async () => {
  const { FromEntity1, FromEntity2, FromEntity5 } = await import("./playground/decorators/FromEntity.ts");
  const db: Connection = new Connection(con1);
  //Left Join with Entity Testing
  const qs1 = db.select().from({ entity: FromEntity1, as: "u1" })
    .rightAndSelect({ entity: FromEntity2, on: `"FromEntity2"."columnKey1" = "u1"."columnKey1"` });
  const q1 = qs1.getSql();
  const qe1 =
    `SELECT "u1"."test1" "test1", "FromEntity2"."test1" "FromEntity2.test1" FROM "FromEntity1" AS "u1" RIGHT JOIN "FromEntity2" ON "FromEntity2"."columnKey1" = "u1"."columnKey1"`;
  assertEquals(q1, qe1);

  const qs2 = db.select().from({ entity: FromEntity1, as: "u1" })
    .rightAndSelect({ entity: FromEntity2, as: "u2", on: `"u2"."columnKey1" = "u1"."columnKey1"` });
  const q2 = qs2.getSql();
  const qe2 =
    `SELECT "u1"."test1" "test1", "u2"."test1" "u2.test1" FROM "FromEntity1" AS "u1" RIGHT JOIN "FromEntity2" AS "u2" ON "u2"."columnKey1" = "u1"."columnKey1"`;
  assertEquals(q2, qe2);

  const qs3 = db.select().from({ entity: FromEntity1, as: "u1" })
    .rightAndSelect({ entity: FromEntity5, on: `"hello"."FromEntity5"."columnKey1" = "u1"."columnKey1"` });
  const q3 = qs3.getSql();
  const qe3 =
    `SELECT "u1"."test1" "test1", "hello"."FromEntity5"."test1" "hello.FromEntity5.test1" FROM "FromEntity1" AS "u1" RIGHT JOIN "hello"."FromEntity5" ON "hello"."FromEntity5"."columnKey1" = "u1"."columnKey1"`;
  assertEquals(q3, qe3);

  const qs4 = db.select().from({ entity: FromEntity1, as: "u1" })
    .rightAndSelect({ entity: FromEntity5, as: "u5", on: `"u5"."columnKey1" = "u1"."columnKey1"` });
  const q4 = qs4.getSql();
  const qe4 =
    `SELECT "u1"."test1" "test1", "u5"."test1" "u5.test1" FROM "FromEntity1" AS "u1" RIGHT JOIN "hello"."FromEntity5" AS "u5" ON "u5"."columnKey1" = "u1"."columnKey1"`;
  assertEquals(q4, qe4);

  /** new param structure */
  const qs5 = db.from({ entity: FromEntity1, as: "u1" })
    .rightAndSelect(FromEntity2, `"FromEntity2"."columnKey1" = "u1"."columnKey1"`);
  const q5 = qs5.getSql();
  const qe5 =
    `SELECT "u1"."test1" "test1", "FromEntity2"."test1" "FromEntity2.test1" FROM "FromEntity1" AS "u1" RIGHT JOIN "FromEntity2" ON "FromEntity2"."columnKey1" = "u1"."columnKey1"`;
  assertEquals(q5, qe5);

  const qs6 = db.from({ entity: FromEntity1, as: "u1" })
    .rightAndSelect(FromEntity2, `"FromEntity2"."columnKey1" = "u1"."columnKey1" AND "u1"."columnKey1" = :key`, {
      key: "xx",
    });
  const q6 = qs6.getSql();
  const qe6 =
    `SELECT "u1"."test1" "test1", "FromEntity2"."test1" "FromEntity2.test1" FROM "FromEntity1" AS "u1" RIGHT JOIN "FromEntity2" ON "FromEntity2"."columnKey1" = "u1"."columnKey1" AND "u1"."columnKey1" = 'xx'`;
  assertEquals(q6, qe6);

  const qs7 = db.from({ entity: FromEntity1, as: "u1" })
    .rightAndSelect(FromEntity2, "u", `"u"."columnKey1" = "u1"."columnKey1"`);
  const q7 = qs7.getSql();
  const qe7 =
    `SELECT "u1"."test1" "test1", "u"."test1" "u.test1" FROM "FromEntity1" AS "u1" RIGHT JOIN "FromEntity2" AS "u" ON "u"."columnKey1" = "u1"."columnKey1"`;
  assertEquals(q7, qe7);

  const qs8 = db.from({ entity: FromEntity1, as: "u1" })
    .rightAndSelect(FromEntity2, "u", `"u"."columnKey1" = "u1"."columnKey1" AND "u1"."columnKey1" = :key`, {
      key: "xx",
    });
  const q8 = qs8.getSql();
  const qe8 =
    `SELECT "u1"."test1" "test1", "u"."test1" "u.test1" FROM "FromEntity1" AS "u1" RIGHT JOIN "FromEntity2" AS "u" ON "u"."columnKey1" = "u1"."columnKey1" AND "u1"."columnKey1" = 'xx'`;
  assertEquals(q8, qe8);
});
Deno.test("right join [select right by 'sub-query'] sql", async () => {
  const { FromEntity1 } = await import("./playground/decorators/FromEntity.ts");
  const db: Connection = new Connection(con1);

  const qs7 = db.from(FromEntity1, "u1")
    .rightAndSelect(db.from(FromEntity1), `"_2"."test1" = "u1"."test1"`);
  const q7 = qs7.getSql();
  const qe7 =
    `SELECT "u1"."test1" "test1", "_2".* FROM "FromEntity1" AS "u1" RIGHT JOIN ( SELECT "FromEntity1"."test1" "test1" FROM "FromEntity1" ) AS "_2" ON "_2"."test1" = "u1"."test1"`;
  assertEquals(q7, qe7);

  const qs8 = db.from(FromEntity1, "u1")
    .rightAndSelect(db.from(FromEntity1), `u2`, `"u2"."test1" = "u1"."test1"`);
  const q8 = qs8.getSql();
  const qe8 =
    `SELECT "u1"."test1" "test1", "u2".* FROM "FromEntity1" AS "u1" RIGHT JOIN ( SELECT "FromEntity1"."test1" "test1" FROM "FromEntity1" ) AS "u2" ON "u2"."test1" = "u1"."test1"`;
  assertEquals(q8, qe8);
});
Deno.test("right join [params] sql", () => {
  const db: Connection = new Connection(con1);

  const qs1 = db.select().from({ entity: "User", as: "u1" })
    .right({
      entity: "UserStatus",
      on: `"UserStatus"."UserStatus_ID" = "u1"."UserStatus_ID" AND "UserStatus"."UserStatus_ID" IN (:list)`,
    }, { list: ["hermy991", "master", 1, 2, 3, 4] });
  const q1 = qs1.getSql();
  const qe1 =
    `SELECT "u1".* FROM "User" AS "u1" RIGHT JOIN "UserStatus" ON "UserStatus"."UserStatus_ID" = "u1"."UserStatus_ID" AND "UserStatus"."UserStatus_ID" IN ('hermy991', 'master', 1, 2, 3, 4)`;
  assertEquals(q1, qe1);

  const qs2 = db.select().from({ entity: "User", as: "u1" })
    .rightAndSelect({
      entity: "UserStatus",
      on: `"UserStatus"."UserStatus_ID" = "u1"."UserStatus_ID" AND "UserStatus"."UserStatus_ID" IN (:list)`,
    }, { list: ["hermy991", "master", 1, 2, 3, 4] });
  const q2 = qs2.getSql();
  const qe2 =
    `SELECT "u1".*, "UserStatus".* FROM "User" AS "u1" RIGHT JOIN "UserStatus" ON "UserStatus"."UserStatus_ID" = "u1"."UserStatus_ID" AND "UserStatus"."UserStatus_ID" IN ('hermy991', 'master', 1, 2, 3, 4)`;
  assertEquals(q2, qe2);

  /** new param structure */

  const qs4 = db.from({ entity: "FromEntity1", as: "u1" })
    .right(
      `User`,
      `"User"."columnKey1" = "FromEntity1"."columnKey1" AND "FromEntity1"."columnKey1" ON (:list)`,
      { list: ["hermy991", "master", 1, 2, 3, 4] },
    );
  const q4 = qs4.getSql();
  const qe4 =
    `SELECT "u1".* FROM "FromEntity1" AS "u1" RIGHT JOIN "User" ON "User"."columnKey1" = "FromEntity1"."columnKey1" AND "FromEntity1"."columnKey1" ON ('hermy991', 'master', 1, 2, 3, 4)`;
  assertEquals(q4, qe4);

  const qs5 = db.from({ entity: "FromEntity1", as: "u1" })
    .right(
      `User`,
      `u`,
      `"u"."columnKey1" = "FromEntity1"."columnKey1" AND "FromEntity1"."columnKey1" ON (:list)`,
      { list: ["hermy991", "master", 1, 2, 3, 4] },
    );
  const q5 = qs5.getSql();
  const qe5 =
    `SELECT "u1".* FROM "FromEntity1" AS "u1" RIGHT JOIN "User" AS "u" ON "u"."columnKey1" = "FromEntity1"."columnKey1" AND "FromEntity1"."columnKey1" ON ('hermy991', 'master', 1, 2, 3, 4)`;
  assertEquals(q5, qe5);

  const qs6 = db.from({ entity: "FromEntity1", as: "u1" })
    .right(
      `hello.User`,
      `"hello"."User"."columnKey1" = "FromEntity1"."columnKey1" AND "FromEntity1"."columnKey1" ON (:list)`,
      { list: ["hermy991", "master", 1, 2, 3, 4] },
    );
  const q6 = qs6.getSql();
  const qe6 =
    `SELECT "u1".* FROM "FromEntity1" AS "u1" RIGHT JOIN "hello"."User" ON "hello"."User"."columnKey1" = "FromEntity1"."columnKey1" AND "FromEntity1"."columnKey1" ON ('hermy991', 'master', 1, 2, 3, 4)`;
  assertEquals(q6, qe6);

  const qs7 = db.from({ entity: "FromEntity1", as: "u1" })
    .right(
      `hello.User`,
      `u`,
      `"u"."columnKey1" = "FromEntity1"."columnKey1" AND "FromEntity1"."columnKey1" ON (:list)`,
      { list: ["hermy991", "master", 1, 2, 3, 4] },
    );
  const q7 = qs7.getSql();
  const qe7 =
    `SELECT "u1".* FROM "FromEntity1" AS "u1" RIGHT JOIN "hello"."User" AS "u" ON "u"."columnKey1" = "FromEntity1"."columnKey1" AND "FromEntity1"."columnKey1" ON ('hermy991', 'master', 1, 2, 3, 4)`;
  assertEquals(q7, qe7);
});
