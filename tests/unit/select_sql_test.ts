import { getTestConnection } from "./tool/tool.ts";
import { between, Connection, like, notLike } from "spinosaurus/mod.ts";
import { assertEquals } from "deno/testing/asserts.ts";

const con1 = getTestConnection();

Deno.test("select [select *] sql", () => {
  const db: Connection = new Connection(con1);
  const qs1 = db.select().from({ entity: "User", as: "u" });
  let q1 = qs1.getQuery() || "";
  q1 = q1.replaceAll(/[ \n\t]+/ig, " ").trim();
  const qe1 = `SELECT "u".* FROM "User" AS "u"`.replace(/[ \n\t]+/ig, " ")
    .trim();
  assertEquals(q1, qe1);
  const qs2 = db.select().from({ entity: "User" });
  let q2 = qs2.getQuery() || "";
  q2 = q2.replaceAll(/[ \n\t]+/ig, " ").trim();
  const qe2 = `SELECT "User".* FROM "User"`.replace(/[ \n\t]+/ig, " ")
    .trim();
  assertEquals(q2, qe2);
  const qs3 = db.select().from({ schema: "hello", entity: "User" });
  let q3 = qs3.getQuery() || "";
  q3 = q3.replaceAll(/[ \n\t]+/ig, " ").trim();
  const qe3 = `SELECT "hello"."User".* FROM "hello"."User"`.replace(
    /[ \n\t]+/ig,
    " ",
  )
    .trim();
  assertEquals(q3, qe3);
  const qs4 = db.select().from({ schema: "hello", entity: "User", as: "u" });
  let q4 = qs4.getQuery() || "";
  q4 = q4.replaceAll(/[ \n\t]+/ig, " ").trim();
  const qe4 = `SELECT "u".* FROM "hello"."User" AS "u"`.replace(
    /[ \n\t]+/ig,
    " ",
  )
    .trim();
  assertEquals(q4, qe4);
});
Deno.test("select [select distinct *] sql", () => {
  const db: Connection = new Connection(con1);
  const qs = db.selectDistinct()
    .from({ entity: "User", as: "u" });
  let query = qs.getQuery() || "";
  query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
  const queryExpected = `SELECT DISTINCT "u".* FROM "User" AS "u"`.replace(
    /[ \n\t]+/ig,
    " ",
  ).trim();
  assertEquals(query, queryExpected);
});
Deno.test("select [select * from 'Entity'] sql", async () => {
  const { FromEntity1, FromEntity2, FromEntity5 } = await import(
    "./playground/decorators/FromEntity.ts"
  );
  const db: Connection = new Connection(con1);
  const qs1 = db.select().from({ entity: FromEntity1, as: "u" });
  let q1 = qs1.getQuery() || "";
  q1 = q1.replaceAll(/[ \n\t]+/ig, " ").trim();
  const qe1 = `SELECT "u"."test1" "test1" FROM "FromEntity1" AS "u"`
    .replace(
      /[ \n\t]+/ig,
      " ",
    )
    .trim();
  assertEquals(q1, qe1);
  const qs2 = db.select().from({ entity: FromEntity2 });
  let q2 = qs2.getQuery() || "";
  q2 = q2.replaceAll(/[ \n\t]+/ig, " ").trim();
  const qe2 = `SELECT "FromEntity2"."test1" "test1" FROM "FromEntity2"`
    .replace(
      /[ \n\t]+/ig,
      " ",
    )
    .trim();
  assertEquals(q2, qe2);
  const qs3 = db.select().from({ entity: FromEntity5 });
  let q3 = qs3.getQuery() || "";
  q3 = q3.replaceAll(/[ \n\t]+/ig, " ").trim();
  const qe3 =
    `SELECT "hello"."FromEntity5"."test1" "test1" FROM "hello"."FromEntity5"`
      .replace(
        /[ \n\t]+/ig,
        " ",
      )
      .trim();
  assertEquals(q3, qe3);
  const qs4 = db.select().from({ entity: FromEntity5, as: "u" });
  let q4 = qs4.getQuery() || "";
  q4 = q4.replaceAll(/[ \n\t]+/ig, " ").trim();
  const qe4 = `SELECT "u"."test1" "test1" FROM "hello"."FromEntity5" AS "u"`
    .replace(
      /[ \n\t]+/ig,
      " ",
    )
    .trim();
  assertEquals(q4, qe4);
});
Deno.test("select [select columns] sql", () => {
  const db: Connection = new Connection(con1);
  const qs = db.select([`u."userName"`], [`u."firstName"`])
    .from({ entity: "User", as: "u" });
  let query = qs.getQuery() || "";
  query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
  const queryExpected = `SELECT u."userName", u."firstName" FROM "User" AS "u"`
    .replace(/[ \n\t]+/ig, " ").trim();
  assertEquals(query, queryExpected);
});
Deno.test("select [select distinct columns] sql", () => {
  const db: Connection = new Connection(con1);
  const qs = db.selectDistinct([`u."userName"`], [`u."firstName"`])
    .from({ entity: "User", as: "u" });
  let query = qs.getQuery() || "";
  query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
  const queryExpected =
    `SELECT DISTINCT u."userName", u."firstName" FROM "User" AS "u"`.replace(
      /[ \n\t]+/ig,
      " ",
    ).trim();
  assertEquals(query, queryExpected);
});
Deno.test("select [select column as] sql", () => {
  const db: Connection = new Connection(con1);
  const qs = db.select([`u."userName"`, "UserName"], [`u."firstName"`])
    .from({ entity: "User", as: "u" });
  let query = qs.getQuery() || "";
  query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
  const queryExpected =
    `SELECT u."userName" AS "UserName", u."firstName" FROM "User" AS "u"`
      .replace(/[ \n\t]+/ig, " ").trim();
  assertEquals(query, queryExpected);
});
Deno.test("select [where] sql", () => {
  const db: Connection = new Connection(con1);
  const qs = db.select([`u."userName"`], [`u."firstName"`])
    .from({ entity: "User", as: "u" })
    .where([`u."userName" = 'hermy991'`]);
  let query = qs.getQuery() || "";
  query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
  const queryExpected =
    `SELECT u."userName", u."firstName" FROM "User" AS "u" WHERE u."userName" = 'hermy991'`
      .replaceAll(/[ \n\t]+/ig, " ").trim();
  assertEquals(query, queryExpected);
});
Deno.test("select [where like] sql", () => {
  const db: Connection = new Connection(con1);
  const qs = db.select([`u."userName"`], [`u."firstName"`])
    .from({ entity: "User", as: "u" })
    .where([like(`u."userName"`, "%hermy%")]);
  let query = qs.getQuery() || "";
  query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
  const queryExpected =
    `SELECT u."userName", u."firstName" FROM "User" AS "u" WHERE u."userName" LIKE '%hermy%'`
      .replaceAll(/[ \n\t]+/ig, " ").trim();
  assertEquals(query, queryExpected);
});
Deno.test("select [where not like] sql", () => {
  const db: Connection = new Connection(con1);
  const qs = db.select([`u."userName"`], [`u."firstName"`])
    .from({ entity: "User", as: "u" })
    .where([notLike(`u."userName"`, "%hermy%")]);
  let query = qs.getQuery() || "";
  query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
  const queryExpected =
    `SELECT u."userName", u."firstName" FROM "User" AS "u" WHERE u."userName" NOT LIKE '%hermy%'`
      .replaceAll(/[ \n\t]+/ig, " ").trim();
  assertEquals(query, queryExpected);
});
Deno.test("select [where between(string)] sql", () => {
  const db: Connection = new Connection(con1);
  const qs = db.select([`u."userName"`], [`u."firstName"`])
    .from({ entity: "User", as: "u" })
    .where([between(`u."userName"`, "0", "3")]);
  let query = qs.getQuery() || "";
  query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
  const queryExpected =
    `SELECT u."userName", u."firstName" FROM "User" AS "u" WHERE u."userName" BETWEEN '0' AND '3'`
      .replaceAll(/[ \n\t]+/ig, " ").trim();
  assertEquals(query, queryExpected);
});
Deno.test("select [where between(number)] sql", () => {
  const db: Connection = new Connection(con1);
  const qs = db.select([`u."userName"`], [`u."firstName"`])
    .from({ entity: "User", as: "u" })
    .where([between(`u."userName"`, 0, 3)]);
  let query = qs.getQuery() || "";
  query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
  const queryExpected =
    `SELECT u."userName", u."firstName" FROM "User" AS "u" WHERE u."userName" BETWEEN 0 AND 3`
      .replaceAll(/[ \n\t]+/ig, " ").trim();
  assertEquals(query, queryExpected);
});
Deno.test("select [where with params] sql", () => {
  const db: Connection = new Connection(con1);
  const qs = db.select([`u."userName"`], [`u."firstName"`])
    .from({ entity: "User", as: "u" })
    .where([`u."userName" = :userName`], { userName: "hermy991" });
  let query = qs.getQuery() || "";
  query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
  const queryExpected =
    `SELECT u."userName", u."firstName" FROM "User" AS "u" WHERE u."userName" = 'hermy991'`
      .replaceAll(/[ \n\t]+/ig, " ").trim();
  assertEquals(query, queryExpected);
});
Deno.test("select [order by] sql", () => {
  const db: Connection = new Connection(con1);
  const qs = db.select([`u."userName"`], [`u."firstName"`])
    .from({ entity: "User", as: "u" })
    .orderBy([`u."userName"`]);
  let query = qs.getQuery() || "";
  query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
  const queryExpected =
    `SELECT u."userName", u."firstName" FROM "User" AS "u" ORDER BY u."userName"`
      .replaceAll(/[ \n\t]+/ig, " ").trim();
  assertEquals(query, queryExpected);
});
Deno.test("select [order by with direction] sql", () => {
  const db: Connection = new Connection(con1);
  const qs = db.select([`u."userName"`], [`u."firstName"`])
    .from({ entity: "User", as: "u" })
    .orderBy([`u."userName"`, `ASC`], [`u."firstName"`, `DESC`])
    .addOrderBy({ column: `u."userName"`, direction: "ASC" });
  let query = qs.getQuery() || "";
  query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
  const queryExpected =
    `SELECT u."userName", u."firstName" FROM "User" AS "u" ORDER BY u."userName" ASC, u."firstName" DESC, u."userName" ASC`
      .replaceAll(/[ \n\t]+/ig, " ").trim();
  assertEquals(query, queryExpected);
});
