import { getTestConnection } from "./tool/tool.ts";
import { Connection } from "spinosaurus/mod.ts";
import { assertEquals } from "deno/testing/asserts.ts";
import {
  FromEntity1,
  FromEntity2,
  // FromEntity4,
  FromEntity5,
} from "./playground/decorators/FromEntity.ts";

const con1 = getTestConnection();

const testMessage = "  {}";

Deno.test(
  testMessage.replace(
    /\{\}/ig,
    "join [join] query",
  ),
  () => {
    const db: Connection = new Connection(con1);
    //Inner Join Testing
    const qs1 = db.select().from({ entity: FromEntity1, as: "u1" })
      .join({
        entity: "FromEntity2",
        on: `"FromEntity2"."columnKey1" = "u1"."columnKey1"`,
      });
    let q1 = qs1.getQuery() || "";
    q1 = q1.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe1 =
      `SELECT "u1"."test1" "test1" FROM "FromEntity1" AS "u1" INNER JOIN "FromEntity2" ON "FromEntity2"."columnKey1" = "u1"."columnKey1"`
        .replace(
          /[ \n\t]+/ig,
          " ",
        )
        .trim();
    assertEquals(q1, qe1);
    const qs2 = db.select().from({ entity: FromEntity1, as: "u1" })
      .join({
        entity: "FromEntity2",
        as: "u2",
        on: `"u2"."columnKey1" = "u1"."columnKey1"`,
      });
    let q2 = qs2.getQuery() || "";
    q2 = q2.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe2 =
      `SELECT "u1"."test1" "test1" FROM "FromEntity1" AS "u1" INNER JOIN "FromEntity2" AS "u2" ON "u2"."columnKey1" = "u1"."columnKey1"`
        .replace(
          /[ \n\t]+/ig,
          " ",
        )
        .trim();
    assertEquals(q2, qe2);
    const qs3 = db.select().from({ entity: FromEntity1, as: "u1" })
      .join({
        schema: "example",
        entity: "FromEntity2",
        on: `"example"."FromEntity2"."columnKey1" = "u1"."columnKey1"`,
      });
    let q3 = qs3.getQuery() || "";
    q3 = q3.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe3 =
      `SELECT "u1"."test1" "test1" FROM "FromEntity1" AS "u1" INNER JOIN "example"."FromEntity2" ON "example"."FromEntity2"."columnKey1" = "u1"."columnKey1"`
        .replace(
          /[ \n\t]+/ig,
          " ",
        )
        .trim();
    assertEquals(q3, qe3);
  },
);
Deno.test(
  testMessage.replace(
    /\{\}/ig,
    "join [join 'Entity'] query",
  ),
  () => {
    const db: Connection = new Connection(con1);
    //Inner Join Testing
    const qs1 = db.select().from({ entity: FromEntity1, as: "u1" })
      .join({
        entity: FromEntity2,
        on: `"FromEntity2"."columnKey1" = "u1"."columnKey1"`,
      });
    let q1 = qs1.getQuery() || "";
    q1 = q1.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe1 =
      `SELECT "u1"."test1" "test1" FROM "FromEntity1" AS "u1" INNER JOIN "FromEntity2" ON "FromEntity2"."columnKey1" = "u1"."columnKey1"`
        .replace(
          /[ \n\t]+/ig,
          " ",
        )
        .trim();
    assertEquals(q1, qe1);
    const qs2 = db.select().from({ entity: FromEntity1, as: "u1" })
      .join({
        entity: FromEntity2,
        as: "u2",
        on: `"u2"."columnKey1" = "u1"."columnKey1"`,
      });
    let q2 = qs2.getQuery() || "";
    q2 = q2.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe2 =
      `SELECT "u1"."test1" "test1" FROM "FromEntity1" AS "u1" INNER JOIN "FromEntity2" AS "u2" ON "u2"."columnKey1" = "u1"."columnKey1"`
        .replace(
          /[ \n\t]+/ig,
          " ",
        )
        .trim();
    assertEquals(q2, qe2);
    const qs3 = db.select().from({ entity: FromEntity1, as: "u1" })
      .join({
        entity: FromEntity5,
        on: `"hello"."FromEntity5"."columnKey1" = "u1"."columnKey1"`,
      });
    let q3 = qs3.getQuery() || "";
    q3 = q3.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe3 =
      `SELECT "u1"."test1" "test1" FROM "FromEntity1" AS "u1" INNER JOIN "hello"."FromEntity5" ON "hello"."FromEntity5"."columnKey1" = "u1"."columnKey1"`
        .replace(
          /[ \n\t]+/ig,
          " ",
        )
        .trim();
    assertEquals(q3, qe3);
    const qs4 = db.select().from({ entity: FromEntity1, as: "u1" })
      .join({
        entity: FromEntity5,
        as: "u5",
        on: `"u5"."columnKey1" = "u1"."columnKey1"`,
      });
    let q4 = qs4.getQuery() || "";
    q4 = q4.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe4 =
      `SELECT "u1"."test1" "test1" FROM "FromEntity1" AS "u1" INNER JOIN "hello"."FromEntity5" AS "u5" ON "u5"."columnKey1" = "u1"."columnKey1"`
        .replace(
          /[ \n\t]+/ig,
          " ",
        )
        .trim();
    assertEquals(q4, qe4);
  },
);
Deno.test(
  testMessage.replace(
    /\{\}/ig,
    "join [select join] query",
  ),
  () => {
    const db: Connection = new Connection(con1);
    //Inner Join Testing
    const qs1 = db.select().from({ entity: FromEntity1, as: "u1" })
      .joinAndSelect({
        entity: "FromEntity2",
        on: `"FromEntity2"."columnKey1" = "u1"."columnKey1"`,
      });
    let q1 = qs1.getQuery() || "";
    q1 = q1.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe1 =
      `SELECT "u1"."test1" "test1", "FromEntity2".* FROM "FromEntity1" AS "u1" INNER JOIN "FromEntity2" ON "FromEntity2"."columnKey1" = "u1"."columnKey1"`
        .replace(
          /[ \n\t]+/ig,
          " ",
        )
        .trim();
    assertEquals(q1, qe1);
    const qs2 = db.select().from({ entity: FromEntity1, as: "u1" })
      .joinAndSelect({
        entity: "FromEntity2",
        as: "u2",
        on: `"u2"."columnKey1" = "u1"."columnKey1"`,
      });
    let q2 = qs2.getQuery() || "";
    q2 = q2.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe2 =
      `SELECT "u1"."test1" "test1", "u2".* FROM "FromEntity1" AS "u1" INNER JOIN "FromEntity2" AS "u2" ON "u2"."columnKey1" = "u1"."columnKey1"`
        .replace(
          /[ \n\t]+/ig,
          " ",
        )
        .trim();
    assertEquals(q2, qe2);
    const qs3 = db.select().from({ entity: FromEntity1, as: "u1" })
      .joinAndSelect({
        schema: "example",
        entity: "FromEntity2",
        on: `"example"."FromEntity2"."columnKey1" = "u1"."columnKey1"`,
      });
    let q3 = qs3.getQuery() || "";
    q3 = q3.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe3 =
      `SELECT "u1"."test1" "test1", "example"."FromEntity2".* FROM "FromEntity1" AS "u1" INNER JOIN "example"."FromEntity2" ON "example"."FromEntity2"."columnKey1" = "u1"."columnKey1"`
        .replace(
          /[ \n\t]+/ig,
          " ",
        )
        .trim();
    assertEquals(q3, qe3);
  },
);
Deno.test(
  testMessage.replace(
    /\{\}/ig,
    "join [select join 'Entity'] query",
  ),
  () => {
    const db: Connection = new Connection(con1);
    //Inner Join Testing
    const qs1 = db.select().from({ entity: FromEntity1, as: "u1" })
      .joinAndSelect({
        entity: FromEntity2,
        on: `"FromEntity2"."columnKey1" = "u1"."columnKey1"`,
      });
    let q1 = qs1.getQuery() || "";
    q1 = q1.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe1 =
      `SELECT "u1"."test1" "test1", "FromEntity2"."test1" "FromEntity2.test1" FROM "FromEntity1" AS "u1" INNER JOIN "FromEntity2" ON "FromEntity2"."columnKey1" = "u1"."columnKey1"`
        .replace(
          /[ \n\t]+/ig,
          " ",
        )
        .trim();
    assertEquals(q1, qe1);
    const qs2 = db.select().from({ entity: FromEntity1, as: "u1" })
      .joinAndSelect({
        entity: FromEntity2,
        as: "u2",
        on: `"u2"."columnKey1" = "u1"."columnKey1"`,
      });
    let q2 = qs2.getQuery() || "";
    q2 = q2.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe2 =
      `SELECT "u1"."test1" "test1", "u2"."test1" "u2.test1" FROM "FromEntity1" AS "u1" INNER JOIN "FromEntity2" AS "u2" ON "u2"."columnKey1" = "u1"."columnKey1"`
        .replace(
          /[ \n\t]+/ig,
          " ",
        )
        .trim();
    assertEquals(q2, qe2);
    const qs3 = db.select().from({ entity: FromEntity1, as: "u1" })
      .joinAndSelect({
        entity: FromEntity5,
        on: `"hello"."FromEntity5"."columnKey1" = "u1"."columnKey1"`,
      });
    let q3 = qs3.getQuery() || "";
    q3 = q3.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe3 =
      `SELECT "u1"."test1" "test1", "hello"."FromEntity5"."test1" "hello.FromEntity5.test1" FROM "FromEntity1" AS "u1" INNER JOIN "hello"."FromEntity5" ON "hello"."FromEntity5"."columnKey1" = "u1"."columnKey1"`
        .replace(
          /[ \n\t]+/ig,
          " ",
        )
        .trim();
    assertEquals(q3, qe3);
    const qs4 = db.select().from({ entity: FromEntity1, as: "u1" })
      .joinAndSelect({
        entity: FromEntity5,
        as: "u5",
        on: `"u5"."columnKey1" = "u1"."columnKey1"`,
      });
    let q4 = qs4.getQuery() || "";
    q4 = q4.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe4 =
      `SELECT "u1"."test1" "test1", "u5"."test1" "u5.test1" FROM "FromEntity1" AS "u1" INNER JOIN "hello"."FromEntity5" AS "u5" ON "u5"."columnKey1" = "u1"."columnKey1"`
        .replace(
          /[ \n\t]+/ig,
          " ",
        )
        .trim();
    assertEquals(q4, qe4);
  },
);
Deno.test(
  testMessage.replace(
    /\{\}/ig,
    "join [left join] query",
  ),
  () => {
    const db: Connection = new Connection(con1);
    //Left Join Testing
    const qs1 = db.select().from({ entity: FromEntity1, as: "u1" })
      .left({
        entity: "FromEntity2",
        on: `"FromEntity2"."columnKey1" = "u1"."columnKey1"`,
      });
    let q1 = qs1.getQuery() || "";
    q1 = q1.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe1 =
      `SELECT "u1"."test1" "test1" FROM "FromEntity1" AS "u1" LEFT JOIN "FromEntity2" ON "FromEntity2"."columnKey1" = "u1"."columnKey1"`
        .replace(
          /[ \n\t]+/ig,
          " ",
        )
        .trim();
    assertEquals(q1, qe1);
    const qs2 = db.select().from({ entity: FromEntity1, as: "u1" })
      .left({
        entity: "FromEntity2",
        as: "u2",
        on: `"u2"."columnKey1" = "u1"."columnKey1"`,
      });
    let q2 = qs2.getQuery() || "";
    q2 = q2.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe2 =
      `SELECT "u1"."test1" "test1" FROM "FromEntity1" AS "u1" LEFT JOIN "FromEntity2" AS "u2" ON "u2"."columnKey1" = "u1"."columnKey1"`
        .replace(
          /[ \n\t]+/ig,
          " ",
        )
        .trim();
    assertEquals(q2, qe2);
    const qs3 = db.select().from({ entity: FromEntity1, as: "u1" })
      .left({
        schema: "example",
        entity: "FromEntity2",
        on: `"example"."FromEntity2"."columnKey1" = "u1"."columnKey1"`,
      });
    let q3 = qs3.getQuery() || "";
    q3 = q3.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe3 =
      `SELECT "u1"."test1" "test1" FROM "FromEntity1" AS "u1" LEFT JOIN "example"."FromEntity2" ON "example"."FromEntity2"."columnKey1" = "u1"."columnKey1"`
        .replace(
          /[ \n\t]+/ig,
          " ",
        )
        .trim();
    assertEquals(q3, qe3);
  },
);
Deno.test(
  testMessage.replace(
    /\{\}/ig,
    "join [left join 'Entity'] query",
  ),
  () => {
    const db: Connection = new Connection(con1);
    //Inner Join Testing
    const qs1 = db.select().from({ entity: FromEntity1, as: "u1" })
      .left({
        entity: FromEntity2,
        on: `"FromEntity2"."columnKey1" = "u1"."columnKey1"`,
      });
    let q1 = qs1.getQuery() || "";
    q1 = q1.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe1 =
      `SELECT "u1"."test1" "test1" FROM "FromEntity1" AS "u1" LEFT JOIN "FromEntity2" ON "FromEntity2"."columnKey1" = "u1"."columnKey1"`
        .replace(
          /[ \n\t]+/ig,
          " ",
        )
        .trim();
    assertEquals(q1, qe1);
    const qs2 = db.select().from({ entity: FromEntity1, as: "u1" })
      .left({
        entity: FromEntity2,
        as: "u2",
        on: `"u2"."columnKey1" = "u1"."columnKey1"`,
      });
    let q2 = qs2.getQuery() || "";
    q2 = q2.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe2 =
      `SELECT "u1"."test1" "test1" FROM "FromEntity1" AS "u1" LEFT JOIN "FromEntity2" AS "u2" ON "u2"."columnKey1" = "u1"."columnKey1"`
        .replace(
          /[ \n\t]+/ig,
          " ",
        )
        .trim();
    assertEquals(q2, qe2);
    const qs3 = db.select().from({ entity: FromEntity1, as: "u1" })
      .left({
        entity: FromEntity5,
        on: `"hello"."FromEntity5"."columnKey1" = "u1"."columnKey1"`,
      });
    let q3 = qs3.getQuery() || "";
    q3 = q3.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe3 =
      `SELECT "u1"."test1" "test1" FROM "FromEntity1" AS "u1" LEFT JOIN "hello"."FromEntity5" ON "hello"."FromEntity5"."columnKey1" = "u1"."columnKey1"`
        .replace(
          /[ \n\t]+/ig,
          " ",
        )
        .trim();
    assertEquals(q3, qe3);
    const qs4 = db.select().from({ entity: FromEntity1, as: "u1" })
      .left({
        entity: FromEntity5,
        as: "u5",
        on: `"u5"."columnKey1" = "u1"."columnKey1"`,
      });
    let q4 = qs4.getQuery() || "";
    q4 = q4.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe4 =
      `SELECT "u1"."test1" "test1" FROM "FromEntity1" AS "u1" LEFT JOIN "hello"."FromEntity5" AS "u5" ON "u5"."columnKey1" = "u1"."columnKey1"`
        .replace(
          /[ \n\t]+/ig,
          " ",
        )
        .trim();
    assertEquals(q4, qe4);
  },
);
Deno.test(
  testMessage.replace(
    /\{\}/ig,
    "join [select left join] query",
  ),
  () => {
    const db: Connection = new Connection(con1);
    //Left Join Testing
    const qs1 = db.select().from({ entity: FromEntity1, as: "u1" })
      .leftAndSelect({
        entity: "FromEntity2",
        on: `"FromEntity2"."columnKey1" = "u1"."columnKey1"`,
      });
    let q1 = qs1.getQuery() || "";
    q1 = q1.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe1 =
      `SELECT "u1"."test1" "test1", "FromEntity2".* FROM "FromEntity1" AS "u1" LEFT JOIN "FromEntity2" ON "FromEntity2"."columnKey1" = "u1"."columnKey1"`
        .replace(
          /[ \n\t]+/ig,
          " ",
        )
        .trim();
    assertEquals(q1, qe1);
    const qs2 = db.select().from({ entity: FromEntity1, as: "u1" })
      .leftAndSelect({
        entity: "FromEntity2",
        as: "u2",
        on: `"u2"."columnKey1" = "u1"."columnKey1"`,
      });
    let q2 = qs2.getQuery() || "";
    q2 = q2.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe2 =
      `SELECT "u1"."test1" "test1", "u2".* FROM "FromEntity1" AS "u1" LEFT JOIN "FromEntity2" AS "u2" ON "u2"."columnKey1" = "u1"."columnKey1"`
        .replace(
          /[ \n\t]+/ig,
          " ",
        )
        .trim();
    assertEquals(q2, qe2);
    const qs3 = db.select().from({ entity: FromEntity1, as: "u1" })
      .leftAndSelect({
        schema: "example",
        entity: "FromEntity2",
        on: `"example"."FromEntity2"."columnKey1" = "u1"."columnKey1"`,
      });
    let q3 = qs3.getQuery() || "";
    q3 = q3.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe3 =
      `SELECT "u1"."test1" "test1", "example"."FromEntity2".* FROM "FromEntity1" AS "u1" LEFT JOIN "example"."FromEntity2" ON "example"."FromEntity2"."columnKey1" = "u1"."columnKey1"`
        .replace(
          /[ \n\t]+/ig,
          " ",
        )
        .trim();
    assertEquals(q3, qe3);
  },
);
Deno.test(
  testMessage.replace(
    /\{\}/ig,
    "join [select left join 'Entity'] query",
  ),
  () => {
    const db: Connection = new Connection(con1);
    //Left Join with Entity Testing
    const qs1 = db.select().from({ entity: FromEntity1, as: "u1" })
      .leftAndSelect({
        entity: FromEntity2,
        on: `"FromEntity2"."columnKey1" = "u1"."columnKey1"`,
      });
    let q1 = qs1.getQuery() || "";
    q1 = q1.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe1 =
      `SELECT "u1"."test1" "test1", "FromEntity2"."test1" "FromEntity2.test1" FROM "FromEntity1" AS "u1" LEFT JOIN "FromEntity2" ON "FromEntity2"."columnKey1" = "u1"."columnKey1"`
        .replace(
          /[ \n\t]+/ig,
          " ",
        )
        .trim();
    assertEquals(q1, qe1);
    const qs2 = db.select().from({ entity: FromEntity1, as: "u1" })
      .leftAndSelect({
        entity: FromEntity2,
        as: "u2",
        on: `"u2"."columnKey1" = "u1"."columnKey1"`,
      });
    let q2 = qs2.getQuery() || "";
    q2 = q2.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe2 =
      `SELECT "u1"."test1" "test1", "u2"."test1" "u2.test1" FROM "FromEntity1" AS "u1" LEFT JOIN "FromEntity2" AS "u2" ON "u2"."columnKey1" = "u1"."columnKey1"`
        .replace(
          /[ \n\t]+/ig,
          " ",
        )
        .trim();
    assertEquals(q2, qe2);
    const qs3 = db.select().from({ entity: FromEntity1, as: "u1" })
      .leftAndSelect({
        entity: FromEntity5,
        on: `"hello"."FromEntity5"."columnKey1" = "u1"."columnKey1"`,
      });
    let q3 = qs3.getQuery() || "";
    q3 = q3.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe3 =
      `SELECT "u1"."test1" "test1", "hello"."FromEntity5"."test1" "hello.FromEntity5.test1" FROM "FromEntity1" AS "u1" LEFT JOIN "hello"."FromEntity5" ON "hello"."FromEntity5"."columnKey1" = "u1"."columnKey1"`
        .replace(
          /[ \n\t]+/ig,
          " ",
        )
        .trim();
    assertEquals(q3, qe3);
    const qs4 = db.select().from({ entity: FromEntity1, as: "u1" })
      .leftAndSelect({
        entity: FromEntity5,
        as: "u5",
        on: `"u5"."columnKey1" = "u1"."columnKey1"`,
      });
    let q4 = qs4.getQuery() || "";
    q4 = q4.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe4 =
      `SELECT "u1"."test1" "test1", "u5"."test1" "u5.test1" FROM "FromEntity1" AS "u1" LEFT JOIN "hello"."FromEntity5" AS "u5" ON "u5"."columnKey1" = "u1"."columnKey1"`
        .replace(
          /[ \n\t]+/ig,
          " ",
        )
        .trim();
    assertEquals(q4, qe4);
  },
);
Deno.test(
  testMessage.replace(
    /\{\}/ig,
    "join [right join] query",
  ),
  () => {
    const db: Connection = new Connection(con1);
    //Right Join Testing
    const qs1 = db.select().from({ entity: FromEntity1, as: "u1" })
      .right({
        entity: "FromEntity2",
        on: `"FromEntity2"."columnKey1" = "u1"."columnKey1"`,
      });
    let q1 = qs1.getQuery() || "";
    q1 = q1.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe1 =
      `SELECT "u1"."test1" "test1" FROM "FromEntity1" AS "u1" RIGHT JOIN "FromEntity2" ON "FromEntity2"."columnKey1" = "u1"."columnKey1"`
        .replace(
          /[ \n\t]+/ig,
          " ",
        )
        .trim();
    assertEquals(q1, qe1);
    const qs2 = db.select().from({ entity: FromEntity1, as: "u1" })
      .right({
        entity: "FromEntity2",
        as: "u2",
        on: `"u2"."columnKey1" = "u1"."columnKey1"`,
      });
    let q2 = qs2.getQuery() || "";
    q2 = q2.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe2 =
      `SELECT "u1"."test1" "test1" FROM "FromEntity1" AS "u1" RIGHT JOIN "FromEntity2" AS "u2" ON "u2"."columnKey1" = "u1"."columnKey1"`
        .replace(
          /[ \n\t]+/ig,
          " ",
        )
        .trim();
    assertEquals(q2, qe2);
    const qs3 = db.select().from({ entity: FromEntity1, as: "u1" })
      .right({
        schema: "example",
        entity: "FromEntity2",
        on: `"example"."FromEntity2"."columnKey1" = "u1"."columnKey1"`,
      });
    let q3 = qs3.getQuery() || "";
    q3 = q3.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe3 =
      `SELECT "u1"."test1" "test1" FROM "FromEntity1" AS "u1" RIGHT JOIN "example"."FromEntity2" ON "example"."FromEntity2"."columnKey1" = "u1"."columnKey1"`
        .replace(
          /[ \n\t]+/ig,
          " ",
        )
        .trim();
    assertEquals(q3, qe3);
  },
);
Deno.test(
  testMessage.replace(
    /\{\}/ig,
    "join [right join 'Entity'] query",
  ),
  () => {
    const db: Connection = new Connection(con1);
    //Inner Join Testing
    const qs1 = db.select().from({ entity: FromEntity1, as: "u1" })
      .right({
        entity: FromEntity2,
        on: `"FromEntity2"."columnKey1" = "u1"."columnKey1"`,
      });
    let q1 = qs1.getQuery() || "";
    q1 = q1.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe1 =
      `SELECT "u1"."test1" "test1" FROM "FromEntity1" AS "u1" RIGHT JOIN "FromEntity2" ON "FromEntity2"."columnKey1" = "u1"."columnKey1"`
        .replace(
          /[ \n\t]+/ig,
          " ",
        )
        .trim();
    assertEquals(q1, qe1);
    const qs2 = db.select().from({ entity: FromEntity1, as: "u1" })
      .right({
        entity: FromEntity2,
        as: "u2",
        on: `"u2"."columnKey1" = "u1"."columnKey1"`,
      });
    let q2 = qs2.getQuery() || "";
    q2 = q2.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe2 =
      `SELECT "u1"."test1" "test1" FROM "FromEntity1" AS "u1" RIGHT JOIN "FromEntity2" AS "u2" ON "u2"."columnKey1" = "u1"."columnKey1"`
        .replace(
          /[ \n\t]+/ig,
          " ",
        )
        .trim();
    assertEquals(q2, qe2);
    const qs3 = db.select().from({ entity: FromEntity1, as: "u1" })
      .right({
        entity: FromEntity5,
        on: `"hello"."FromEntity5"."columnKey1" = "u1"."columnKey1"`,
      });
    let q3 = qs3.getQuery() || "";
    q3 = q3.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe3 =
      `SELECT "u1"."test1" "test1" FROM "FromEntity1" AS "u1" RIGHT JOIN "hello"."FromEntity5" ON "hello"."FromEntity5"."columnKey1" = "u1"."columnKey1"`
        .replace(
          /[ \n\t]+/ig,
          " ",
        )
        .trim();
    assertEquals(q3, qe3);
    const qs4 = db.select().from({ entity: FromEntity1, as: "u1" })
      .right({
        entity: FromEntity5,
        as: "u5",
        on: `"u5"."columnKey1" = "u1"."columnKey1"`,
      });
    let q4 = qs4.getQuery() || "";
    q4 = q4.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe4 =
      `SELECT "u1"."test1" "test1" FROM "FromEntity1" AS "u1" RIGHT JOIN "hello"."FromEntity5" AS "u5" ON "u5"."columnKey1" = "u1"."columnKey1"`
        .replace(
          /[ \n\t]+/ig,
          " ",
        )
        .trim();
    assertEquals(q4, qe4);
  },
);
Deno.test(
  testMessage.replace(
    /\{\}/ig,
    "join [select right join] query",
  ),
  () => {
    const db: Connection = new Connection(con1);
    //Right Join Testing
    const qs1 = db.select().from({ entity: FromEntity1, as: "u1" })
      .rightAndSelect({
        entity: "FromEntity2",
        on: `"FromEntity2"."columnKey1" = "u1"."columnKey1"`,
      });
    let q1 = qs1.getQuery() || "";
    q1 = q1.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe1 =
      `SELECT "u1"."test1" "test1", "FromEntity2".* FROM "FromEntity1" AS "u1" RIGHT JOIN "FromEntity2" ON "FromEntity2"."columnKey1" = "u1"."columnKey1"`
        .replace(
          /[ \n\t]+/ig,
          " ",
        )
        .trim();
    assertEquals(q1, qe1);
    const qs2 = db.select().from({ entity: FromEntity1, as: "u1" })
      .rightAndSelect({
        entity: "FromEntity2",
        as: "u2",
        on: `"u2"."columnKey1" = "u1"."columnKey1"`,
      });
    let q2 = qs2.getQuery() || "";
    q2 = q2.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe2 =
      `SELECT "u1"."test1" "test1", "u2".* FROM "FromEntity1" AS "u1" RIGHT JOIN "FromEntity2" AS "u2" ON "u2"."columnKey1" = "u1"."columnKey1"`
        .replace(
          /[ \n\t]+/ig,
          " ",
        )
        .trim();
    assertEquals(q2, qe2);
    const qs3 = db.select().from({ entity: FromEntity1, as: "u1" })
      .rightAndSelect({
        schema: "example",
        entity: "FromEntity2",
        on: `"example"."FromEntity2"."columnKey1" = "u1"."columnKey1"`,
      });
    let q3 = qs3.getQuery() || "";
    q3 = q3.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe3 =
      `SELECT "u1"."test1" "test1", "example"."FromEntity2".* FROM "FromEntity1" AS "u1" RIGHT JOIN "example"."FromEntity2" ON "example"."FromEntity2"."columnKey1" = "u1"."columnKey1"`
        .replace(
          /[ \n\t]+/ig,
          " ",
        )
        .trim();
    assertEquals(q3, qe3);
  },
);
Deno.test(
  testMessage.replace(
    /\{\}/ig,
    "join [select right join 'Entity'] query",
  ),
  () => {
    const db: Connection = new Connection(con1);
    //Left Join with Entity Testing
    const qs1 = db.select().from({ entity: FromEntity1, as: "u1" })
      .rightAndSelect({
        entity: FromEntity2,
        on: `"FromEntity2"."columnKey1" = "u1"."columnKey1"`,
      });
    let q1 = qs1.getQuery() || "";
    q1 = q1.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe1 =
      `SELECT "u1"."test1" "test1", "FromEntity2"."test1" "FromEntity2.test1" FROM "FromEntity1" AS "u1" RIGHT JOIN "FromEntity2" ON "FromEntity2"."columnKey1" = "u1"."columnKey1"`
        .replace(
          /[ \n\t]+/ig,
          " ",
        )
        .trim();
    assertEquals(q1, qe1);
    const qs2 = db.select().from({ entity: FromEntity1, as: "u1" })
      .rightAndSelect({
        entity: FromEntity2,
        as: "u2",
        on: `"u2"."columnKey1" = "u1"."columnKey1"`,
      });
    let q2 = qs2.getQuery() || "";
    q2 = q2.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe2 =
      `SELECT "u1"."test1" "test1", "u2"."test1" "u2.test1" FROM "FromEntity1" AS "u1" RIGHT JOIN "FromEntity2" AS "u2" ON "u2"."columnKey1" = "u1"."columnKey1"`
        .replace(
          /[ \n\t]+/ig,
          " ",
        )
        .trim();
    assertEquals(q2, qe2);
    const qs3 = db.select().from({ entity: FromEntity1, as: "u1" })
      .rightAndSelect({
        entity: FromEntity5,
        on: `"hello"."FromEntity5"."columnKey1" = "u1"."columnKey1"`,
      });
    let q3 = qs3.getQuery() || "";
    q3 = q3.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe3 =
      `SELECT "u1"."test1" "test1", "hello"."FromEntity5"."test1" "hello.FromEntity5.test1" FROM "FromEntity1" AS "u1" RIGHT JOIN "hello"."FromEntity5" ON "hello"."FromEntity5"."columnKey1" = "u1"."columnKey1"`
        .replace(
          /[ \n\t]+/ig,
          " ",
        )
        .trim();
    assertEquals(q3, qe3);
    const qs4 = db.select().from({ entity: FromEntity1, as: "u1" })
      .rightAndSelect({
        entity: FromEntity5,
        as: "u5",
        on: `"u5"."columnKey1" = "u1"."columnKey1"`,
      });
    let q4 = qs4.getQuery() || "";
    q4 = q4.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe4 =
      `SELECT "u1"."test1" "test1", "u5"."test1" "u5.test1" FROM "FromEntity1" AS "u1" RIGHT JOIN "hello"."FromEntity5" AS "u5" ON "u5"."columnKey1" = "u1"."columnKey1"`
        .replace(
          /[ \n\t]+/ig,
          " ",
        )
        .trim();
    assertEquals(q4, qe4);
  },
);
