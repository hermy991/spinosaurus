import { getTestConnection } from "./tool/tool.ts";
import { _NOW, Connection } from "spinosaurus/mod.ts";
import { assertEquals } from "deno/testing/asserts.ts";

const con1 = getTestConnection();
Deno.test("function [anonymous function] sql", () => {
  const db: Connection = new Connection(con1);
  const qs1 = db.create({ entity: "User" })
    .columns([{
      name: "column1",
      spitype: "date",
      default: () => "NOW() - interval '12 hour'",
    }]);
  const q1 = qs1.getSql();
  const qe1 = `CREATE TABLE "User" ( "column1" DATE DEFAULT NOW() - interval '12 hour' )`
    .replace(/[ \n\t]+/ig, " ")
    .trim();
  assertEquals(q1, qe1);
  // const qs2 = db.select().from({ entity: "User" });
  // let q2 = qs2.getSqls() || "";
  // q2 = q2;
  // const qe2 = `SELECT "User".* FROM "User"`.replace(/[ \n\t]+/ig, " ")
  //   .trim();
  // assertEquals(q2, qe2);
  // const qs3 = db.select().from({ schema: "hello", entity: "User" });
  // let q3 = qs3.getSqls() || "";
  // q3 = q3;
  // const qe3 = `SELECT "hello"."User".* FROM "hello"."User"`.replace(
  //   /[ \n\t]+/ig,
  //   " ",
  // )
  //   .trim();
  // assertEquals(q3, qe3);
  // const qs4 = db.select().from({ schema: "hello", entity: "User", as: "u" });
  // let q4 = qs4.getSqls() || "";
  // q4 = q4;
  // const qe4 = `SELECT "u".* FROM "hello"."User" AS "u"`.replace(
  //   /[ \n\t]+/ig,
  //   " ",
  // )
  //   .trim();
  // assertEquals(q4, qe4);
});
Deno.test("function [now] sql", () => {
  const db: Connection = new Connection(con1);
  const qs1 = db.create({ entity: "User" })
    .columns([{
      name: "column1",
      spitype: "date",
      default: _NOW,
    }]);
  const q1 = qs1.getSql();
  const qe1 = `CREATE TABLE "User" ( "column1" DATE DEFAULT now() )`
    .replace(/[ \n\t]+/ig, " ")
    .trim();
  assertEquals(q1, qe1);
  // const qs2 = db.select().from({ entity: "User" });
  // let q2 = qs2.getSqls() || "";
  // q2 = q2;
  // const qe2 = `SELECT "User".* FROM "User"`.replace(/[ \n\t]+/ig, " ")
  //   .trim();
  // assertEquals(q2, qe2);
  // const qs3 = db.select().from({ schema: "hello", entity: "User" });
  // let q3 = qs3.getSqls() || "";
  // q3 = q3;
  // const qe3 = `SELECT "hello"."User".* FROM "hello"."User"`.replace(
  //   /[ \n\t]+/ig,
  //   " ",
  // )
  //   .trim();
  // assertEquals(q3, qe3);
  // const qs4 = db.select().from({ schema: "hello", entity: "User", as: "u" });
  // let q4 = qs4.getSqls() || "";
  // q4 = q4;
  // const qe4 = `SELECT "u".* FROM "hello"."User" AS "u"`.replace(
  //   /[ \n\t]+/ig,
  //   " ",
  // )
  //   .trim();
  // assertEquals(q4, qe4);
});
