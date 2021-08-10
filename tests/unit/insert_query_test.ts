import { getTestConnection } from "./tool/tool.ts";
import { Connection } from "spinosaurus/mod.ts";
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
  testMessage.replace(/\{\}/ig, "insert [insert] query should work"),
  () => {
    const db: Connection = new Connection(con1);
    const qs = db.insert(["User"])
      .values({ column1: "xx" });
    let query = qs.getQuery() || "";
    query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
    const queryExpected = `INSERT INTO "User" ("column1") VALUES ('xx')`
      .replaceAll(/[ \n\t]+/ig, " ").trim();
    assertEquals(query, queryExpected);
  },
);

Deno.test(
  testMessage.replace(/\{\}/ig, "insert [insert 'Entity'] query should work"),
  () => {
    const db: Connection = new Connection(con1);
    const qs1 = db.insert(FromEntity1)
      .values({ column1: "xx" });
    let q1 = qs1.getQuery() || "";
    q1 = q1.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe1 = `INSERT INTO "FromEntity1" ("column1") VALUES ('xx')`
      .replaceAll(/[ \n\t]+/ig, " ").trim();
    assertEquals(q1, qe1);

    const qs2 = db.insert(FromEntity2)
      .values({ column1: "xx" });
    let q2 = qs2.getQuery() || "";
    q2 = q2.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe2 = `INSERT INTO "FromEntity2" ("column1") VALUES ('xx')`
      .replaceAll(/[ \n\t]+/ig, " ").trim();
    assertEquals(q2, qe2);

    const qs3 = db.insert(FromEntity4)
      .values({ column1: "xx" });
    let q3 = qs3.getQuery() || "";
    q3 = q3.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe3 = `INSERT INTO "FromEntity3" ("column1") VALUES ('xx')`
      .replaceAll(/[ \n\t]+/ig, " ").trim();
    assertEquals(q3, qe3);

    const qs4 = db.insert(FromEntity5)
      .values({ column1: "xx" });
    let q4 = qs4.getQuery() || "";
    q4 = q4.replaceAll(/[ \n\t]+/ig, " ").trim();
    const qe4 = `INSERT INTO "hello"."FromEntity5" ("column1") VALUES ('xx')`
      .replaceAll(/[ \n\t]+/ig, " ").trim();
    assertEquals(q4, qe4);
  },
);
Deno.test(
  testMessage.replace(/\{\}/ig, "insert [multiple insert] query should work"),
  () => {
    const db: Connection = new Connection(con1);
    const qs = db.insert(["User"])
      .values([{ column1: "x1" }, { column1: "x2" }]);
    let query = qs.getQuery() || "";
    query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
    const queryExpected =
      `INSERT INTO "User" ("column1") VALUES ('x1'); INSERT INTO "User" ("column1") VALUES ('x2')`
        .replaceAll(/[ \n\t]+/ig, " ").trim();
    assertEquals(query, queryExpected);
  },
);
Deno.test(
  testMessage.replace(
    /\{\}/ig,
    "insert [multiple insert with schema] query should work",
  ),
  () => {
    const db: Connection = new Connection(con1);
    const qs = db.insert(["User", "public"])
      .values([{ column1: "x1" }, { column1: "x2" }]);
    let query = qs.getQuery() || "";
    query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
    const queryExpected =
      `INSERT INTO "public"."User" ("column1") VALUES ('x1'); INSERT INTO "public"."User" ("column1") VALUES ('x2')`
        .replaceAll(/[ \n\t]+/ig, " ").trim();
    assertEquals(query, queryExpected);
  },
);
