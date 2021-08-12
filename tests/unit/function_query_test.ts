import { getTestConnection } from "./tool/tool.ts";
import { _NOW, Connection } from "spinosaurus/mod.ts";
import { assertEquals } from "deno/testing/asserts.ts";

const con1 = getTestConnection();
Deno.test("function [anonim function] query", () => {
  const db: Connection = new Connection(con1);
  const qs1 = db.create({ entity: "User" }).columns({
    columnName: "column1",
    spitype: "date",
    default: () => "NOW() - interval '12 hour'",
  });
  let q1 = qs1.getQuery() || "";
  q1 = q1.replaceAll(/[ \n\t]+/ig, " ").trim();
  const qe1 =
    `CREATE TABLE "User" ( "column1" DATE DEFAULT NOW() - interval '12 hour' )`
      .replace(/[ \n\t]+/ig, " ")
      .trim();
  assertEquals(q1, qe1);
  // const qs2 = db.select().from({ entity: "User" });
  // let q2 = qs2.getQuery() || "";
  // q2 = q2.replaceAll(/[ \n\t]+/ig, " ").trim();
  // const qe2 = `SELECT "User".* FROM "User"`.replace(/[ \n\t]+/ig, " ")
  //   .trim();
  // assertEquals(q2, qe2);
  // const qs3 = db.select().from({ schema: "hello", entity: "User" });
  // let q3 = qs3.getQuery() || "";
  // q3 = q3.replaceAll(/[ \n\t]+/ig, " ").trim();
  // const qe3 = `SELECT "hello"."User".* FROM "hello"."User"`.replace(
  //   /[ \n\t]+/ig,
  //   " ",
  // )
  //   .trim();
  // assertEquals(q3, qe3);
  // const qs4 = db.select().from({ schema: "hello", entity: "User", as: "u" });
  // let q4 = qs4.getQuery() || "";
  // q4 = q4.replaceAll(/[ \n\t]+/ig, " ").trim();
  // const qe4 = `SELECT "u".* FROM "hello"."User" AS "u"`.replace(
  //   /[ \n\t]+/ig,
  //   " ",
  // )
  //   .trim();
  // assertEquals(q4, qe4);
});
Deno.test("function [now] query", () => {
  const db: Connection = new Connection(con1);
  const qs1 = db.create({ entity: "User" }).columns({
    columnName: "column1",
    spitype: "date",
    default: _NOW(),
  });
  let q1 = qs1.getQuery() || "";
  q1 = q1.replaceAll(/[ \n\t]+/ig, " ").trim();
  const qe1 = `CREATE TABLE "User" ( "column1" DATE DEFAULT now() )`
    .replace(/[ \n\t]+/ig, " ")
    .trim();
  assertEquals(q1, qe1);
  // const qs2 = db.select().from({ entity: "User" });
  // let q2 = qs2.getQuery() || "";
  // q2 = q2.replaceAll(/[ \n\t]+/ig, " ").trim();
  // const qe2 = `SELECT "User".* FROM "User"`.replace(/[ \n\t]+/ig, " ")
  //   .trim();
  // assertEquals(q2, qe2);
  // const qs3 = db.select().from({ schema: "hello", entity: "User" });
  // let q3 = qs3.getQuery() || "";
  // q3 = q3.replaceAll(/[ \n\t]+/ig, " ").trim();
  // const qe3 = `SELECT "hello"."User".* FROM "hello"."User"`.replace(
  //   /[ \n\t]+/ig,
  //   " ",
  // )
  //   .trim();
  // assertEquals(q3, qe3);
  // const qs4 = db.select().from({ schema: "hello", entity: "User", as: "u" });
  // let q4 = qs4.getQuery() || "";
  // q4 = q4.replaceAll(/[ \n\t]+/ig, " ").trim();
  // const qe4 = `SELECT "u".* FROM "hello"."User" AS "u"`.replace(
  //   /[ \n\t]+/ig,
  //   " ",
  // )
  //   .trim();
  // assertEquals(q4, qe4);
});
