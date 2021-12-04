import { getTestConnection } from "./tool/tool.ts";
import { between, Connection, like, notLike } from "spinosaurus/mod.ts";
import { assertEquals } from "deno/testing/asserts.ts";

const con1 = getTestConnection();

Deno.test("select [select *] sql", () => {
  const db: Connection = new Connection(con1);
  const qs1 = db.select().from({ entity: "User", as: "u" });
  const q1 = qs1.getSql();
  const qe1 = `SELECT "u".* FROM "User" AS "u"`;
  assertEquals(q1, qe1);

  const qs2 = db.select().from({ entity: "User" });
  const q2 = qs2.getSql();
  const qe2 = `SELECT "User".* FROM "User"`
    .trim();
  assertEquals(q2, qe2);

  const qs3 = db.select().from({ schema: "hello", entity: "User" });
  const q3 = qs3.getSql();
  const qe3 = `SELECT "hello"."User".* FROM "hello"."User"`;
  assertEquals(q3, qe3);

  const qs4 = db.select().from({ schema: "hello", entity: "User", as: "u" });
  const q4 = qs4.getSql();
  const qe4 = `SELECT "u".* FROM "hello"."User" AS "u"`;
  assertEquals(q4, qe4);

  const qs5 = db.from({ schema: "hello", entity: "User", as: "u" });
  const q5 = qs5.getSql();
  const qe5 = `SELECT "u".* FROM "hello"."User" AS "u"`;
  assertEquals(q5, qe5);

  const qs6 = db.from("User");
  const q6 = qs6.getSql();
  const qe6 = `SELECT "User".* FROM "User"`;
  assertEquals(q6, qe6);

  const qs7 = db.from("hello.User");
  const q7 = qs7.getSql();
  const qe7 = `SELECT "hello"."User".* FROM "hello"."User"`;
  assertEquals(q7, qe7);

  const qs8 = db.from("User", "u");
  const q8 = qs8.getSql();
  const qe8 = `SELECT "u".* FROM "User" AS "u"`;
  assertEquals(q8, qe8);

  const qs9 = db.from("hello.User", "u");
  const q9 = qs9.getSql();
  const qe9 = `SELECT "u".* FROM "hello"."User" AS "u"`;
  assertEquals(q9, qe9);
});
Deno.test("select [select distinct *] sql", () => {
  const db: Connection = new Connection(con1);
  const qs = db.selectDistinct()
    .from({ entity: "User", as: "u" });
  const query = qs.getSql();
  const queryExpected = `SELECT DISTINCT "u".* FROM "User" AS "u"`;
  assertEquals(query, queryExpected);
});
Deno.test("select [select * from by 'class'] sql", async () => {
  const { SelectEntity1, SelectEntity2, SelectEntity5 } = await import("./playground/decorators/SelectEntity.ts");

  const db: Connection = new Connection(con1);
  const qs1 = db.select().from({ entity: SelectEntity1, as: "u" });
  const q1 = qs1.getSql();
  const qe1 = `SELECT "u"."test1" "test1", "u"."test2" "test2", "u"."custom" "custom" FROM "SelectEntityCustom" AS "u"`;
  assertEquals(q1, qe1);

  const qs2 = db.select().from({ entity: SelectEntity2 });
  const q2 = qs2.getSql();
  const qe2 =
    `SELECT "SelectEntity2"."test1" "test1", "SelectEntity2"."test2" "test2", "SelectEntity2"."test3" "test3" FROM "SelectEntity2"`;
  assertEquals(q2, qe2);

  const qs3 = db.select().from(SelectEntity5);
  const q3 = qs3.getSql();
  const qe3 =
    `SELECT "hello"."SelectEntity5"."test1" "test1", "hello"."SelectEntity5"."test2" "test2" FROM "hello"."SelectEntity5"`;
  assertEquals(q3, qe3);

  const qs4 = db.select().from({ entity: SelectEntity5, as: "u" });
  const q4 = qs4.getSql();
  const qe4 = `SELECT "u"."test1" "test1", "u"."test2" "test2" FROM "hello"."SelectEntity5" AS "u"`;
  assertEquals(q4, qe4);

  const qs5 = db.from({ entity: SelectEntity5, as: "u" });
  const q5 = qs5.getSql();
  const qe5 = `SELECT "u"."test1" "test1", "u"."test2" "test2" FROM "hello"."SelectEntity5" AS "u"`;
  assertEquals(q5, qe5);
});
Deno.test("select [select columns] sql", () => {
  const db: Connection = new Connection(con1);
  const qs = db.select([`u."userName"`], [`u."firstName"`])
    .from({ entity: "User", as: "u" });
  const query = qs.getSql();
  const queryExpected = `SELECT u."userName", u."firstName" FROM "User" AS "u"`;
  assertEquals(query, queryExpected);
});
Deno.test("select [select distinct columns] sql", () => {
  const db: Connection = new Connection(con1);
  const qs = db.selectDistinct([`u."userName"`], [`u."firstName"`])
    .from({ entity: "User", as: "u" });
  const query = qs.getSql();
  const queryExpected = `SELECT DISTINCT u."userName", u."firstName" FROM "User" AS "u"`.replace(
    /[ \n\t]+/ig,
    " ",
  ).trim();
  assertEquals(query, queryExpected);
});
Deno.test("select [select column as] sql", () => {
  const db: Connection = new Connection(con1);
  const qs = db.select([`u."userName"`, "UserName"], [`u."firstName"`])
    .from({ entity: "User", as: "u" });
  const query = qs.getSql();
  const queryExpected = `SELECT u."userName" AS "UserName", u."firstName" FROM "User" AS "u"`;
  assertEquals(query, queryExpected);
});
Deno.test("select [where] sql", () => {
  const db: Connection = new Connection(con1);
  const qs1 = db.select([`u."userName"`], [`u."firstName"`])
    .from({ entity: "User", as: "u" })
    .where([`u."userName" = 'hermy991'`]);
  const q1 = qs1.getSql();
  const qe1 = `SELECT u."userName", u."firstName" FROM "User" AS "u" WHERE u."userName" = 'hermy991'`;
  assertEquals(q1, qe1);
  const qs2 = db.select([`u."userName"`], [`u."firstName"`])
    .from({ entity: "User", as: "u" })
    .where([`u."userName" = 'hermy991'`])
    .andWhere(`u."userName" = 'hermy992'`)
    .orWhere(`u."userName" = 'hermy993'`);
  const q2 = qs2.getSql();
  const qe2 =
    `SELECT u."userName", u."firstName" FROM "User" AS "u" WHERE u."userName" = 'hermy991' AND u."userName" = 'hermy992' OR u."userName" = 'hermy993'`;
  assertEquals(q2, qe2);
});
Deno.test("select [where like] sql", () => {
  const db: Connection = new Connection(con1);
  const qs = db.select([`u."userName"`], [`u."firstName"`])
    .from({ entity: "User", as: "u" })
    .where([like(`u."userName"`, "%hermy%")]);
  const query = qs.getSql();
  const queryExpected = `SELECT u."userName", u."firstName" FROM "User" AS "u" WHERE u."userName" LIKE '%hermy%'`;
  assertEquals(query, queryExpected);
});
Deno.test("select [where not like] sql", () => {
  const db: Connection = new Connection(con1);
  const qs = db.select([`u."userName"`], [`u."firstName"`])
    .from({ entity: "User", as: "u" })
    .where([notLike(`u."userName"`, "%hermy%")]);
  const query = qs.getSql();
  const queryExpected = `SELECT u."userName", u."firstName" FROM "User" AS "u" WHERE u."userName" NOT LIKE '%hermy%'`;
  assertEquals(query, queryExpected);
});
Deno.test("select [where between(string)] sql", () => {
  const db: Connection = new Connection(con1);
  const qs = db.select([`u."userName"`], [`u."firstName"`])
    .from({ entity: "User", as: "u" })
    .where([between(`u."userName"`, "0", "3")]);
  const query = qs.getSql();
  const queryExpected = `SELECT u."userName", u."firstName" FROM "User" AS "u" WHERE u."userName" BETWEEN '0' AND '3'`;
  assertEquals(query, queryExpected);
});
Deno.test("select [where between(number)] sql", () => {
  const db: Connection = new Connection(con1);
  const qs = db.select([`u."userName"`], [`u."firstName"`])
    .from({ entity: "User", as: "u" })
    .where([between(`u."userName"`, 0, 3)]);
  const query = qs.getSql();
  const queryExpected = `SELECT u."userName", u."firstName" FROM "User" AS "u" WHERE u."userName" BETWEEN 0 AND 3`;
  assertEquals(query, queryExpected);
});
Deno.test("select [where with params] sql", () => {
  const db: Connection = new Connection(con1);
  const qs1 = db.select([`u."userName"`], [`u."firstName"`])
    .from({ entity: "User", as: "u" })
    .where([`u."userName" = :userName`], { userName: "hermy991" });
  const q1 = qs1.getSql();
  const qe1 = `SELECT u."userName", u."firstName" FROM "User" AS "u" WHERE u."userName" = 'hermy991'`;
  assertEquals(q1, qe1);

  const qs2 = db.select([`u."userName"`], [`u."firstName"`])
    .from({ entity: "User", as: "u" })
    .where([`u."userName" IN (:list)`], { list: ["hermy991", "master", "xxx"] });
  const q2 = qs2.getSql();
  const qe2 =
    `SELECT u."userName", u."firstName" FROM "User" AS "u" WHERE u."userName" IN ('hermy991', 'master', 'xxx')`;
  assertEquals(q2, qe2);

  const qs3 = db.select([`u."userName"`], [`u."firstName"`])
    .from({ entity: "User", as: "u" })
    .where([`u."user_ID" IN (:list)`], { list: [1, 2, 3, 4, 5, 6, 7, 8, 9] });
  const q3 = qs3.getSql();
  const qe3 = `SELECT u."userName", u."firstName" FROM "User" AS "u" WHERE u."user_ID" IN (1, 2, 3, 4, 5, 6, 7, 8, 9)`;
  assertEquals(q3, qe3);

  const qs4 = db.select([`u."userName"`], [`u."firstName"`])
    .from({ entity: "User", as: "u" })
    .where([`u."user_ID" IN (:list)`], { list: ["xxx", "hermy991", 7, 8, 9] });
  const q4 = qs4.getSql();
  const qe4 = `SELECT u."userName", u."firstName" FROM "User" AS "u" WHERE u."user_ID" IN ('xxx', 'hermy991', 7, 8, 9)`;
  assertEquals(q4, qe4);
});
Deno.test("select [group by] sql", () => {
  const db: Connection = new Connection(con1);
  const qs = db.select([`u."userName"`], [`u."firstName"`], [`COUNT(*)`, "count"])
    .from({ entity: "User", as: "u" })
    .groupBy(`u."userName"`)
    .addGroupBy([`u."firstName"`]);
  const query = qs.getSql();
  const queryExpected =
    `SELECT u."userName", u."firstName", COUNT(*) AS "count" FROM "User" AS "u" GROUP BY u."userName", u."firstName"`;
  assertEquals(query, queryExpected);
});
Deno.test("select [having] sql", () => {
  const db: Connection = new Connection(con1);
  const qs1 = db.select([`u."userName"`], [`u."firstName"`]).from({ entity: "User", as: "u" })
    .having([`u."userName" = 'hermy991'`]);
  const q1 = qs1.getSql();
  const qe1 = `SELECT u."userName", u."firstName" FROM "User" AS "u" HAVING u."userName" = 'hermy991'`;
  assertEquals(q1, qe1);

  const qs2 = db.select(
    [`u."userName"`],
    [`u."firstName"`],
    [`count(*)`, "sum"],
    [`avg(prictureQuantity)`, "avg"],
    [`sum(u."prictureQuantity")`, "prictureQuantity"],
  ).from({ entity: "User", as: "u" })
    .groupBy(`u."userName"`)
    .addGroupBy([`u."firstName"`])
    .having([`count(*) > 5`])
    .andHaving(`avg(prictureQuantity) < 200`)
    .orHaving(`sum(u."prictureQuantity") < 1000`);
  const q2 = qs2.getSql();
  const qe2 =
    `SELECT u."userName", u."firstName", count(*) AS "sum", avg(prictureQuantity) AS "avg", sum(u."prictureQuantity") AS "prictureQuantity" FROM "User" AS "u" GROUP BY u."userName", u."firstName" HAVING count(*) > 5 AND avg(prictureQuantity) < 200 OR sum(u."prictureQuantity") < 1000`;
  assertEquals(q2, qe2);

  const qs3 = db.select([`u."userName"`], [`u."firstName"`]).from({ entity: "User", as: "u" })
    .having([`u."userName" IN (:list)`], { list: ["hermy991", "master", "xxx"] });
  const q3 = qs3.getSql();
  const qe3 =
    `SELECT u."userName", u."firstName" FROM "User" AS "u" HAVING u."userName" IN ('hermy991', 'master', 'xxx')`;
  assertEquals(q3, qe3);

  const qs4 = db.select([`u."userName"`], [`u."firstName"`]).from({ entity: "User", as: "u" })
    .having([`u."user_ID" IN (:list)`], { list: [1, 2, 3, 4, 5, 6, 7, 8, 9] });
  const q4 = qs4.getSql();
  const qe4 = `SELECT u."userName", u."firstName" FROM "User" AS "u" HAVING u."user_ID" IN (1, 2, 3, 4, 5, 6, 7, 8, 9)`;
  assertEquals(q4, qe4);

  const qs5 = db.select([`u."userName"`], [`u."firstName"`]).from({ entity: "User", as: "u" })
    .having([`u."user_ID" IN (:list)`], { list: ["hermy991", "master", "xxx", 7, 8, 9] });
  const q5 = qs5.getSql();
  const qe5 =
    `SELECT u."userName", u."firstName" FROM "User" AS "u" HAVING u."user_ID" IN ('hermy991', 'master', 'xxx', 7, 8, 9)`;
  assertEquals(q5, qe5);
});
Deno.test("select [order by] sql", () => {
  const db: Connection = new Connection(con1);
  const qs = db.select([`u."userName"`], [`u."firstName"`])
    .from({ entity: "User", as: "u" })
    .orderBy([`u."userName"`]);
  const query = qs.getSql();
  const queryExpected = `SELECT u."userName", u."firstName" FROM "User" AS "u" ORDER BY u."userName"`;
  assertEquals(query, queryExpected);
});
Deno.test("select [order by with direction] sql", () => {
  const db: Connection = new Connection(con1);
  const qs = db.select([`u."userName"`], [`u."firstName"`])
    .from({ entity: "User", as: "u" })
    .orderBy([`u."userName"`, `ASC`], [`u."firstName"`, `DESC`])
    .addOrderBy({ column: `u."userName"`, direction: "ASC" });
  const query = qs.getSql();
  const queryExpected =
    `SELECT u."userName", u."firstName" FROM "User" AS "u" ORDER BY u."userName" ASC, u."firstName" DESC, u."userName" ASC`;
  assertEquals(query, queryExpected);
});
