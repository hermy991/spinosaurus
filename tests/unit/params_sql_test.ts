import { getTestConnection } from "./tool/tool.ts";
import { Connection } from "spinosaurus/mod.ts";
import { assertEquals } from "deno/testing/asserts.ts";

const con1 = getTestConnection();

Deno.test("params [joins] sql", async () => {
  const { FromEntity1 } = await import("./playground/decorators/FromEntity.ts");
  const db: Connection = new Connection(con1);
  //Inner Join Testing
  const simpleParams = { _boolean: true, _string: "hola", _number: 100.10 };
  const qs1 = db.select()
    .from({ entity: FromEntity1, as: "u1" })
    .join({
      entity: "FromEntity2",
      on:
        `"FromEntity2"."columnKey1" = "u1"."columnKey1" AND "FromEntity2"."active" = :_boolean`,
    }, simpleParams);
  let q1 = qs1.getSql() || "";
  q1 = q1.replaceAll(/[ \n\t]+/ig, " ").trim();
  const qe1 = `SELECT "u1"."test1" "test1"
FROM "FromEntity1" AS "u1"
INNER JOIN "FromEntity2" ON "FromEntity2"."columnKey1" = "u1"."columnKey1" AND "FromEntity2"."active" = '1'`
    .replace(
      /[ \n\t]+/ig,
      " ",
    )
    .trim();
  assertEquals(q1, qe1);
  const qs2 = db.select()
    .from({ entity: FromEntity1, as: "u1" })
    .join({
      entity: "FromEntity2",
      on:
        `"FromEntity2"."columnKey1" = "u1"."columnKey1" AND "FromEntity2"."active" = :_boolean`,
    })
    .params(simpleParams);
  let q2 = qs2.getSql() || "";
  q2 = q2.replaceAll(/[ \n\t]+/ig, " ").trim();
  const qe2 = `SELECT "u1"."test1" "test1"
FROM "FromEntity1" AS "u1"
INNER JOIN "FromEntity2" ON "FromEntity2"."columnKey1" = "u1"."columnKey1" AND "FromEntity2"."active" = '1'`
    .replace(
      /[ \n\t]+/ig,
      " ",
    )
    .trim();
  assertEquals(q2, qe2);
  const qs3 = db.select()
    .from({ entity: FromEntity1, as: "u1" })
    .join({
      entity: "FromEntity2",
      on:
        `"FromEntity2"."columnKey1" = "u1"."columnKey1" AND "FromEntity2"."active" = :_boolean`,
    })
    .addParams(simpleParams);
  let q3 = qs3.getSql() || "";
  q3 = q3.replaceAll(/[ \n\t]+/ig, " ").trim();
  const qe3 = `SELECT "u1"."test1" "test1"
FROM "FromEntity1" AS "u1"
INNER JOIN "FromEntity2" ON "FromEntity2"."columnKey1" = "u1"."columnKey1" AND "FromEntity2"."active" = '1'`
    .replace(/[ \n\t]+/ig, " ")
    .trim();
  assertEquals(q3, qe3);
});
Deno.test("params [where] sql", async () => {
  const { FromEntity1 } = await import("./playground/decorators/FromEntity.ts");
  const db: Connection = new Connection(con1);
  //Inner Join Testing
  const simpleParams = { _boolean: true, _string: "hola", _number: 100.10 };
  const qs1 = db.select()
    .from({ entity: FromEntity1, as: "u1" })
    .where(`"FromEntity2"."active" = :_boolean`, simpleParams);
  let q1 = qs1.getSql() || "";
  q1 = q1.replaceAll(/[ \n\t]+/ig, " ").trim();
  const qe1 = `SELECT "u1"."test1" "test1"
FROM "FromEntity1" AS "u1"
WHERE "FromEntity2"."active" = '1'`
    .replace(/[ \n\t]+/ig, " ")
    .trim();
  assertEquals(q1, qe1);
  const qs2 = db.select()
    .from({ entity: FromEntity1, as: "u1" })
    .where(`"FromEntity2"."active" = :_boolean`)
    .params(simpleParams);
  let q2 = qs2.getSql() || "";
  q2 = q2.replaceAll(/[ \n\t]+/ig, " ").trim();
  const qe2 = `SELECT "u1"."test1" "test1"
FROM "FromEntity1" AS "u1"
WHERE "FromEntity2"."active" = '1'`
    .replace(/[ \n\t]+/ig, " ")
    .trim();
  assertEquals(q2, qe2);
  const qs3 = db.select()
    .from({ entity: FromEntity1, as: "u1" })
    .where(`"FromEntity2"."active" = :_boolean`)
    .addParams(simpleParams);
  let q3 = qs3.getSql() || "";
  q3 = q3.replaceAll(/[ \n\t]+/ig, " ").trim();
  const qe3 = `SELECT "u1"."test1" "test1"
FROM "FromEntity1" AS "u1"
WHERE "FromEntity2"."active" = '1'`
    .replace(/[ \n\t]+/ig, " ")
    .trim();
  assertEquals(q3, qe3);
});

Deno.test("params [having] sql", async () => {
  const { FromEntity1 } = await import("./playground/decorators/FromEntity.ts");
  const db: Connection = new Connection(con1);
  //Inner Join Testing
  const simpleParams = { _boolean: true, _string: "hola", _number: 100.10 };
  const qs1 = db.select()
    .from({ entity: FromEntity1, as: "u1" })
    .having(`"FromEntity2"."active" = :_boolean`, simpleParams);
  let q1 = qs1.getSql() || "";
  q1 = q1.replaceAll(/[ \n\t]+/ig, " ").trim();
  const qe1 = `SELECT "u1"."test1" "test1"
FROM "FromEntity1" AS "u1"
HAVING "FromEntity2"."active" = '1'`
    .replace(/[ \n\t]+/ig, " ")
    .trim();
  assertEquals(q1, qe1);
  const qs2 = db.select()
    .from({ entity: FromEntity1, as: "u1" })
    .having(`"FromEntity2"."active" = :_boolean`)
    .params(simpleParams);
  let q2 = qs2.getSql() || "";
  q2 = q2.replaceAll(/[ \n\t]+/ig, " ").trim();
  const qe2 = `SELECT "u1"."test1" "test1"
FROM "FromEntity1" AS "u1"
HAVING "FromEntity2"."active" = '1'`
    .replace(/[ \n\t]+/ig, " ")
    .trim();
  assertEquals(q2, qe2);
  const qs3 = db.select()
    .from({ entity: FromEntity1, as: "u1" })
    .addHaving([`"FromEntity2"."active" = :_boolean`])
    .addParams(simpleParams);
  let q3 = qs3.getSql() || "";
  q3 = q3.replaceAll(/[ \n\t]+/ig, " ").trim();
  const qe3 = `SELECT "u1"."test1" "test1"
FROM "FromEntity1" AS "u1"
HAVING "FromEntity2"."active" = '1'`
    .replace(/[ \n\t]+/ig, " ")
    .trim();
  assertEquals(q3, qe3);
});
