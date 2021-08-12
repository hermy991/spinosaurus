import { getTestConnection } from "./tool/tool.ts";
import { Connection } from "spinosaurus/mod.ts";
import { assertEquals } from "deno/testing/asserts.ts";

const con1 = getTestConnection();
/*********************
 * ENTITY DDL QUERY
 *********************/
Deno.test("create [create table] query", () => {
  const db: Connection = new Connection(con1);
  const qs = db.create({ entity: "User", schema: "public" })
    .columns({ columnName: "column1", spitype: "varchar" });
  let query = qs.getQuery() || "";
  query = query.replaceAll(/[ \n\t]+/ig, " ").trim();
  const queryExpected = `CREATE TABLE "public"."User" ( "column1" VARCHAR )`
    .replace(/[ \n\t]+/ig, " ").trim();
  assertEquals(query, queryExpected);
});
Deno.test("create [create table with data] query", () => {
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
Deno.test("create [create table with primary key] query", () => {
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
Deno.test("create [create table with auto-increment] query", () => {
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
Deno.test("create [create table with auto-increment and primary key] query", () => {
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
Deno.test("create [create schema] query", () => {
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
