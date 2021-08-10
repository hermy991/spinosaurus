import { getTestConnection } from "./tool/tool.ts";
import { between, Connection, like, notLike } from "spinosaurus/mod.ts";
import { assertEquals } from "deno/testing/asserts.ts";
import {
  FromEntity1,
  FromEntity2,
  FromEntity4,
  FromEntity5,
} from "./playground/decorators/FromEntity.ts";

const con1 = getTestConnection();

const testMessage = "  {}";

Deno.test(
  testMessage.replace(/\{\}/ig, "select [select *] query should work"),
  () => {
    const db: Connection = new Connection(con1);
    const qs = db.select().from({ entity: "User", as: "u" });
    let query = qs.getQuery() || "";
    query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
    const queryExpected = `SELECT "u".* FROM "User" AS "u"`.replace(
      /[ \n\t]+/ig,
      " ",
    )
      .trim();
    assertEquals(query, queryExpected);
  },
);
Deno.test(
  testMessage.replace(/\{\}/ig, "select [select distinct *] query should work"),
  () => {
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
  },
);
Deno.test(
  testMessage.replace(
    /\{\}/ig,
    "select [select * from 'Entity'] query should work",
  ),
  () => {
    const db: Connection = new Connection(con1);
    const qs1 = db.select().from({ entity: FromEntity1, as: "u" });
    let q1 = qs1.getQuery() || "";
    q1 = q1.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe1 = `SELECT "u".* FROM "FromEntity1" AS "u"`.replace(
      /[ \n\t]+/ig,
      " ",
    )
      .trim();
    assertEquals(q1, qe1);
    const qs2 = db.select().from({ entity: FromEntity2, as: "u" });
    let q2 = qs2.getQuery() || "";
    q2 = q2.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe2 = `SELECT "u".* FROM "FromEntity2" AS "u"`.replace(
      /[ \n\t]+/ig,
      " ",
    )
      .trim();
    assertEquals(q2, qe2);
    const qs3 = db.select().from({ entity: FromEntity4, as: "u" });
    let q3 = qs3.getQuery() || "";
    q3 = q3.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe3 = `SELECT "u".* FROM "FromEntity3" AS "u"`.replace(
      /[ \n\t]+/ig,
      " ",
    )
      .trim();
    assertEquals(q3, qe3);
    const qs4 = db.select().from({ entity: FromEntity5, as: "u" });
    let q4 = qs4.getQuery() || "";
    q4 = q4.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe4 = `SELECT "u".* FROM "hello"."FromEntity5" AS "u"`.replace(
      /[ \n\t]+/ig,
      " ",
    )
      .trim();
    assertEquals(q4, qe4);
  },
);
Deno.test(
  testMessage.replace(/\{\}/ig, "select [select columns] query should work"),
  () => {
    const db: Connection = new Connection(con1);
    const qs = db.select([`u."userName"`], [`u."firstName"`])
      .from({ entity: "User", as: "u" });
    let query = qs.getQuery() || "";
    query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
    const queryExpected =
      `SELECT u."userName", u."firstName" FROM "User" AS "u"`
        .replace(/[ \n\t]+/ig, " ").trim();
    assertEquals(query, queryExpected);
  },
);
Deno.test(
  testMessage.replace(
    /\{\}/ig,
    "select [select distinct columns] query should work",
  ),
  () => {
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
  },
);
Deno.test(
  testMessage.replace(/\{\}/ig, "select [select column as] query should work"),
  () => {
    const db: Connection = new Connection(con1);
    const qs = db.select([`u."userName"`, "UserName"], [`u."firstName"`])
      .from({ entity: "User", as: "u" });
    let query = qs.getQuery() || "";
    query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
    const queryExpected =
      `SELECT u."userName" AS "UserName", u."firstName" FROM "User" AS "u"`
        .replace(/[ \n\t]+/ig, " ").trim();
    assertEquals(query, queryExpected);
  },
);
Deno.test(
  testMessage.replace(/\{\}/ig, "select [where] query should work"),
  () => {
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
  },
);
Deno.test(
  testMessage.replace(/\{\}/ig, "select [where like] query should work"),
  () => {
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
  },
);
Deno.test(
  testMessage.replace(/\{\}/ig, "select [where not like] query should work"),
  () => {
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
  },
);
Deno.test(
  testMessage.replace(
    /\{\}/ig,
    "select [where between(string)] query should work",
  ),
  () => {
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
  },
);
Deno.test(
  testMessage.replace(
    /\{\}/ig,
    "select [where between(number)] query should work",
  ),
  () => {
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
  },
);
Deno.test(
  testMessage.replace(
    /\{\}/ig,
    "select [where between(Date)] query should work",
  ),
  () => {
    const db: Connection = new Connection(con1);
    const qs = db.select([`u."userName"`], [`u."firstName"`])
      .from({ entity: "User", as: "u" })
      .where([
        between(
          `u."userName"`,
          new Date("2021-01-01T00:00:00"),
          new Date("2021-01-31T00:00:00"),
        ),
      ]);
    let query = qs.getQuery() || "";
    query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
    const queryExpected =
      `SELECT u."userName", u."firstName" FROM "User" AS "u" WHERE u."userName" BETWEEN TO_DATE('2021-01-01', 'YYYY-MM-DD') AND TO_DATE('2021-01-31', 'YYYY-MM-DD')`
        .replaceAll(/[ \n\t]+/ig, " ").trim();
    assertEquals(query, queryExpected);
  },
);
Deno.test(
  testMessage.replace(/\{\}/ig, "select [where with params] query should work"),
  () => {
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
  },
);
Deno.test(
  testMessage.replace(/\{\}/ig, "select [order by] query should work"),
  () => {
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
  },
);
Deno.test(
  testMessage.replace(
    /\{\}/ig,
    "select [order by with direction] query should work",
  ),
  () => {
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
  },
);
