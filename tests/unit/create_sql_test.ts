import { getTestConnection } from "./tool/tool.ts";
import { Connection } from "spinosaurus/mod.ts";
import { assertEquals } from "deno/testing/asserts.ts";

const con1 = getTestConnection();
/*********************
 * ENTITY DDL QUERY
 *********************/
Deno.test("create [create table] sql", () => {
  const db: Connection = new Connection(con1);
  const qs = db.create({ entity: "User", schema: "public" })
    .columns({ columnName: "column1", spitype: "varchar" });
  let query = qs.getQuery() || "";
  query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
  const queryExpected = `CREATE TABLE "public"."User" ( "column1" VARCHAR )`
    .replace(/[ \n\t]+/ig, " ").trim();
  assertEquals(query, queryExpected);
});
Deno.test("create [create table with data] sql", () => {
  const db: Connection = new Connection(con1);
  const qs = db.create({ entity: "User", schema: "public" })
    .columns({ columnName: "column1", spitype: "varchar" })
    .data([{ column1: "hola" }, { column1: "xx" }]);
  let query = qs.getQuery() || "";
  query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
  const queryExpected =
    `CREATE TABLE "public"."User" ( "column1" VARCHAR ); INSERT INTO "public"."User" ("column1") VALUES ('hola'); INSERT INTO "public"."User" ("column1") VALUES ('xx')`
      .replace(/[ \n\t]+/ig, " ").trim();
  assertEquals(query, queryExpected);
});
Deno.test("create [create table with primary key] sql", () => {
  const db: Connection = new Connection(con1);
  const qs = db.create({ entity: "User", schema: "public" })
    .columns({ columnName: "column1", spitype: "integer", primary: true })
    .addColumn({ columnName: "column2", spitype: "varchar" });
  let query = qs.getQuery() || "";
  query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
  const queryExpected =
    `CREATE TABLE "public"."User" ( "column1" INTEGER PRIMARY KEY, "column2" VARCHAR )`
      .replace(/[ \n\t]+/ig, " ").trim();
  assertEquals(query, queryExpected);
});
Deno.test("create [create table with auto-increment] sql", () => {
  const db: Connection = new Connection(con1);
  {
    const qs = db.create({ entity: "User", schema: "public" })
      .columns({
        columnName: "column1",
        spitype: "integer",
        autoIncrement: "increment",
      })
      .addColumn({ columnName: "column2", spitype: "varchar" });
    let query = qs.getQuery() || "";
    query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
    const queryExpected =
      `CREATE TABLE "public"."User" ( "column1" SERIAL, "column2" VARCHAR )`
        .replace(/[ \n\t]+/ig, " ").trim();
    assertEquals(query, queryExpected);
  }
  {
    const qs = db.create({ entity: "User", schema: "public" })
      .columns({
        columnName: "column1",
        autoIncrement: "increment",
      })
      .addColumn({ columnName: "column2", spitype: "varchar" });
    let query = qs.getQuery() || "";
    query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
    const queryExpected =
      `CREATE TABLE "public"."User" ( "column1" SERIAL, "column2" VARCHAR )`
        .replace(/[ \n\t]+/ig, " ").trim();
    assertEquals(query, queryExpected);
  }
  {
    const qs1 = db.create({ entity: "User", schema: "public" })
      .columns({
        columnName: "column1",
        spitype: "varchar",
        autoIncrement: "uuid",
      })
      .addColumn({ columnName: "column2", spitype: "varchar" });
    let query = qs1.getQuery() || "";
    query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
    const queryExpected =
      `CREATE TABLE "public"."User" ( "column1" VARCHAR DEFAULT gen_random_uuid()::text, "column2" VARCHAR )`
        .replace(/[ \n\t]+/ig, " ").trim();
    assertEquals(query, queryExpected);
  }
  {
    const qs1 = db.create({ entity: "User", schema: "public" })
      .columns({
        columnName: "column1",
        autoIncrement: "uuid",
      })
      .addColumn({ columnName: "column2", spitype: "varchar" });
    let query = qs1.getQuery() || "";
    query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
    const queryExpected =
      `CREATE TABLE "public"."User" ( "column1" UUID DEFAULT gen_random_uuid(), "column2" VARCHAR )`
        .replace(/[ \n\t]+/ig, " ").trim();
    assertEquals(query, queryExpected);
  }
  {
    const qs1 = db.create({ entity: "User", schema: "public" })
      .columns({
        columnName: "column1",
        spitype: "varchar",
        length: 30,
        autoIncrement: "uuid",
      })
      .addColumn({ columnName: "column2", spitype: "varchar" });
    let query = qs1.getQuery() || "";
    query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
    const queryExpected =
      `CREATE TABLE "public"."User" ( "column1" CHARACTER VARYING (30) DEFAULT gen_random_uuid()::text, "column2" VARCHAR )`
        .replace(/[ \n\t]+/ig, " ").trim();
    assertEquals(query, queryExpected);
  }
});
Deno.test("create [create table with auto-increment and primary key] sql", () => {
  const db: Connection = new Connection(con1);
  {
    const qs = db.create({ entity: "User", schema: "public" })
      .columns({
        columnName: "column1",
        autoIncrement: "increment",
        primary: true,
      })
      .addColumn({ columnName: "column2", spitype: "varchar" });
    let query = qs.getQuery() || "";
    query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
    const queryExpected =
      `CREATE TABLE "public"."User" ( "column1" SERIAL PRIMARY KEY, "column2" VARCHAR )`
        .replace(/[ \n\t]+/ig, " ").trim();
    assertEquals(query, queryExpected);
  }
  {
    const qs = db.create({ entity: "User", schema: "public" })
      .columns({
        columnName: "column1",
        autoIncrement: "uuid",
        primary: true,
      })
      .addColumn({ columnName: "column2", spitype: "varchar" });
    let query = qs.getQuery() || "";
    query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
    const queryExpected =
      `CREATE TABLE "public"."User" ( "column1" UUID DEFAULT gen_random_uuid() PRIMARY KEY, "column2" VARCHAR )`
        .replace(/[ \n\t]+/ig, " ").trim();
    assertEquals(query, queryExpected);
  }
});
Deno.test("create [create schema] sql", () => {
  const db: Connection = new Connection(con1);
  let q1 = db.create({ schema: "publicX" })
    .getQuery() || "";
  q1 = q1.replaceAll(/[ \n\t]+/ig, " ").trim();
  const qe1 = `CREATE SCHEMA "publicX"`
    .replace(/[ \n\t]+/ig, " ").trim();
  assertEquals(q1, qe1);

  let q2 = db.create({ schema: "publicX", check: true })
    .getQuery() || "";
  q2 = q2.replaceAll(/[ \n\t]+/ig, " ").trim();
  const qe2 = `CREATE SCHEMA IF NOT EXISTS "publicX"`
    .replace(/[ \n\t]+/ig, " ").trim();
  assertEquals(q2, qe2);
});
Deno.test("create [create relations] sql", () => {
  const db: Connection = new Connection(con1);
  let q1 = db.create({ schema: "publicX", entity: "User" })
    .relations({
      columns: ["AnotherEntity1Column_ID"],
      parentEntity: "AnotherEntity1",
    })
    .addRelation({
      columns: ["AnotherEntity2Column_ID"],
      parentEntity: "AnotherEntity2",
    })
    .getQuery() || "";
  q1 = q1.replaceAll(/[ \n\t]+/ig, " ").trim();
  const qe1 =
    `ALTER TABLE "publicX"."User" ADD CONSTRAINT "FK_publicX_User_AnotherEntity1_cdd96d3cc73d1dbdaffa03cc6cd7339b" FOREIGN KEY ("AnotherEntity1Column_ID") REFERENCES "AnotherEntity1" ("AnotherEntity1Column_ID");
ALTER TABLE "publicX"."User" ADD CONSTRAINT "FK_publicX_User_AnotherEntity2_0b7e7dee87b1c3b98e72131173dfbbbf" FOREIGN KEY ("AnotherEntity2Column_ID") REFERENCES "AnotherEntity2" ("AnotherEntity2Column_ID")`
      .replace(/[ \n\t]+/ig, " ").trim();
  assertEquals(q1, qe1);
  let q2 = db.create({ schema: "publicX", entity: "User" })
    .relations({
      columns: ["Column_ID"],
      parentSchema: "anotherSchema",
      parentEntity: "AnotherEntity1",
      parentColumns: ["AnotherEntity1Column_ID"],
    })
    .addRelation({
      columns: ["Column_ID"],
      parentSchema: "anotherSchema",
      parentEntity: "AnotherEntity2",
      parentColumns: ["AnotherEntity2Column_ID"],
    })
    .getQuery() || "";
  q2 = q2.replaceAll(/[ \n\t]+/ig, " ").trim();
  const qe2 =
    `ALTER TABLE "publicX"."User" ADD CONSTRAINT "FK_publicX_User_AnotherEntity1_cdd96d3cc73d1dbdaffa03cc6cd7339b" FOREIGN KEY ("Column_ID") REFERENCES "anotherSchema"."AnotherEntity1" ("AnotherEntity1Column_ID");
ALTER TABLE "publicX"."User" ADD CONSTRAINT "FK_publicX_User_AnotherEntity2_0b7e7dee87b1c3b98e72131173dfbbbf" FOREIGN KEY ("Column_ID") REFERENCES "anotherSchema"."AnotherEntity2" ("AnotherEntity2Column_ID")`
      .replace(/[ \n\t]+/ig, " ").trim();
  assertEquals(q2, qe2);
  let q3 = db.create({ schema: "publicX", entity: "User" })
    .relations({
      name: "FK_publicX_User_AnotherEntity1",
      columns: ["Column_ID"],
      parentSchema: "anotherSchema",
      parentEntity: "AnotherEntity1",
      parentColumns: ["AnotherEntity1Column_ID"],
    })
    .getQuery() || "";
  q3 = q3.replaceAll(/[ \n\t]+/ig, " ").trim();
  const qe3 =
    `ALTER TABLE "publicX"."User" ADD CONSTRAINT "FK_publicX_User_AnotherEntity1" FOREIGN KEY ("Column_ID") REFERENCES "anotherSchema"."AnotherEntity1" ("AnotherEntity1Column_ID")`
      .replace(/[ \n\t]+/ig, " ").trim();
  assertEquals(q3, qe3);
});
