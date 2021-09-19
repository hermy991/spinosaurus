import { getTestConnection } from "./tool/tool.ts";
import { assertEquals } from "deno/testing/asserts.ts";
import {
  Connection,
  // createConnection,
  getMetadata,
  sqlConnection,
} from "spinosaurus/mod.ts";
import * as path from "deno/path/mod.ts";
// import * as luxon from "luxon/mod.ts";

async function clearPlayground(
  db: any,
  tables: Array<any>,
  schemas: Array<any>,
) {
  /**
   * Dropping tables
   */
  for (const table of tables) {
    const co = await db.checkObject(table.mixeds);
    if (co.exists) {
      const t = { entity: co.name, schema: co.schema };
      await db.drop(t).execute();
    }
  }
  /**
   * Dropping schemas
   */
  for (const schema of schemas) {
    const cs = await db.checkSchema({ name: schema.name });
    if (cs.exists) {
      const t = { schema: cs.name, check: true };
      await db.drop(t).execute();
    }
  }
}

const conOpts = getTestConnection();

Deno.test("decorator [check] sql", async () => {
  const conOptsX = self.structuredClone(conOpts);
  const db = new Connection(conOptsX);
  const dirname = path.dirname(path.fromFileUrl(import.meta.url));
  conOptsX.entities = [`${dirname}/playground/decorators/**/CheckEntity.ts`];
  const s1 = (await sqlConnection(conOptsX)).join(";\n");
  const _metadata = getMetadata(conOptsX.name);
  await clearPlayground(db, _metadata.tables, _metadata.schemas);
  const se1 = `CREATE SCHEMA "decorator";
CREATE TABLE "decorator"."CheckEntity1" ( "column1" SERIAL PRIMARY KEY, "column2" CHARACTER VARYING (100) NOT NULL );
ALTER TABLE "decorator"."CheckEntity1" ADD CONSTRAINT "CHK_decorator_CheckEntity1_cdd96d" CHECK (LENGTH("column2") > 0);
ALTER TABLE "decorator"."CheckEntity1" ADD CONSTRAINT "CHK_CheckEntity1_column2_2" CHECK (LENGTH("column2") > 0)`;
  assertEquals(s1, se1);
});

Deno.test("decorator [unique] sql", async () => {
  const conOptsX = self.structuredClone(conOpts);
  const db = new Connection(conOptsX);
  const dirname = path.dirname(path.fromFileUrl(import.meta.url));
  conOptsX.entities = [`${dirname}/playground/decorators/**/UniqueEntity.ts`];
  const s1 = (await sqlConnection(conOptsX)).join(";\n");
  const _metadata = getMetadata(conOptsX.name);
  await clearPlayground(db, _metadata.tables, _metadata.schemas);
  const se1 = `CREATE SCHEMA "decorator";
CREATE TABLE "decorator"."UniqueEntity1" ( "column1" SERIAL PRIMARY KEY, "column2" CHARACTER VARYING (100) NOT NULL, "column3" CHARACTER VARYING (100) NOT NULL, "custom4" CHARACTER VARYING (100) NOT NULL, "custom5" CHARACTER VARYING (100) NOT NULL, "column6" CHARACTER VARYING (100) NOT NULL, "column7" CHARACTER VARYING (100) NOT NULL, "column8" CHARACTER VARYING (100) NOT NULL, "custom9" CHARACTER VARYING (100) NOT NULL, "custom10" CHARACTER VARYING (100) NOT NULL, "custom11" CHARACTER VARYING (100) NOT NULL );
ALTER TABLE "decorator"."UniqueEntity1" ADD CONSTRAINT "UQ_decorator_UniqueEntity1_cdd96d" UNIQUE ("column8");
ALTER TABLE "decorator"."UniqueEntity1" ADD CONSTRAINT "UQ_decorator_UniqueEntity1_0b7e7d" UNIQUE ("custom11");
ALTER TABLE "decorator"."UniqueEntity1" ADD CONSTRAINT "UQ_decorator_UniqueEntity1_0b24df" UNIQUE ("column6", "column7", "custom9", "custom10");
ALTER TABLE "decorator"."UniqueEntity1" ADD CONSTRAINT "UQ_decorator_UniqueEntity1_f7947d" UNIQUE ("column2");
ALTER TABLE "decorator"."UniqueEntity1" ADD CONSTRAINT "UQ_decorator_UniqueEntity1_8b9af1" UNIQUE ("column2", "column3");
ALTER TABLE "decorator"."UniqueEntity1" ADD CONSTRAINT "UQ_decorator_UniqueEntity1_006d12" UNIQUE ("column2", "column3", "custom4");
ALTER TABLE "decorator"."UniqueEntity1" ADD CONSTRAINT "UQ_decorator_UniqueEntity1_b523ff" UNIQUE ("custom4", "custom5");
ALTER TABLE "decorator"."UniqueEntity1" ADD CONSTRAINT "UQ_UniqueEntity1_1" UNIQUE ("column2");
ALTER TABLE "decorator"."UniqueEntity1" ADD CONSTRAINT "UQ_UniqueEntity1_2" UNIQUE ("column2", "column3");
ALTER TABLE "decorator"."UniqueEntity1" ADD CONSTRAINT "UQ_UniqueEntity1_3" UNIQUE ("column2", "column3", "custom4");
ALTER TABLE "decorator"."UniqueEntity1" ADD CONSTRAINT "UQ_UniqueEntity1_4" UNIQUE ("custom4", "custom5");
CREATE TABLE "decorator"."UniqueEntity2" ( "column1" SERIAL PRIMARY KEY, "UniqueEntity1_column1_1" INTEGER NOT NULL, "column3" TEXT NOT NULL, "xx" INTEGER NOT NULL, "UniqueEntity1_column1_2" INTEGER NOT NULL );
ALTER TABLE "decorator"."UniqueEntity2" ADD CONSTRAINT "UQ_decorator_UniqueEntity2_cdd96d" UNIQUE ("UniqueEntity1_column1_1", "column3");
ALTER TABLE "decorator"."UniqueEntity2" ADD CONSTRAINT "UQ_decorator_UniqueEntity2_0b7e7d" UNIQUE ("xx", "UniqueEntity1_column1_2");
ALTER TABLE "decorator"."UniqueEntity2" ADD CONSTRAINT "FK_decorator_UniqueEntity2_UniqueEntity1_cdd96d" FOREIGN KEY ("UniqueEntity1_column1_1") REFERENCES "decorator"."UniqueEntity1" ("column1");
ALTER TABLE "decorator"."UniqueEntity2" ADD CONSTRAINT "FK_decorator_UniqueEntity2_UniqueEntity1_0b7e7d" FOREIGN KEY ("xx") REFERENCES "decorator"."UniqueEntity1" ("column1");
ALTER TABLE "decorator"."UniqueEntity2" ADD CONSTRAINT "FK_decorator_UniqueEntity2_UniqueEntity1_0b24df" FOREIGN KEY ("UniqueEntity1_column1_2") REFERENCES "decorator"."UniqueEntity1" ("column1")`;
  console.log("s1", s1);
  assertEquals(s1, se1);
});
Deno.test("decorator [inherit] sql", async () => {
  const conOptsX = self.structuredClone(conOpts);
  const db = new Connection(conOptsX);
  const dirname = path.dirname(path.fromFileUrl(import.meta.url));
  conOptsX.entities = [
    `${dirname}/playground/decorators/**/DerivedEntity.ts`,
  ];
  const s1 = (await sqlConnection(conOptsX)).join(";\n");
  const _metadata = getMetadata(conOptsX.name);
  await clearPlayground(db, _metadata.tables, _metadata.schemas);
  const se1 =
    `CREATE TABLE "public"."DerivedEntity1" ( "derivedColumn1" SERIAL PRIMARY KEY, "derivedColumn2" NUMERIC NOT NULL, "derivedColumn3" NUMERIC NOT NULL, "superColumn1" TEXT NOT NULL, "superColumn2" TEXT NOT NULL, "superColumn3" TEXT NOT NULL );
CREATE TABLE "public"."SubEntity2" ( "derivedColumn7" SERIAL PRIMARY KEY, "derivedColumn8" NUMERIC NOT NULL, "baseColumn3" NUMERIC NOT NULL, "superColumn1" TEXT NOT NULL, "superColumn2" TEXT NOT NULL, "superColumn3" TEXT NOT NULL )`;
  assertEquals(s1, se1);
});
Deno.test("decorator [data] sql", async () => {
  const conOptsX = self.structuredClone(conOpts);
  const db = new Connection(conOptsX);
  const dirname = path.dirname(path.fromFileUrl(import.meta.url));
  conOptsX.entities = [
    `${dirname}/playground/decorators/**/DataEntity.ts`,
  ];
  const s1 = (await sqlConnection(conOptsX)).join(";\n");
  const _metadata = getMetadata(conOptsX.name);
  await clearPlayground(db, _metadata.tables, _metadata.schemas);
  const se1 = `CREATE SCHEMA "decorator";
CREATE TABLE "decorator"."DataEntity1" ( "column1" SERIAL PRIMARY KEY, "column2" CHARACTER VARYING (100) NOT NULL );
INSERT INTO "decorator"."DataEntity1" ("column2") VALUES ('hola como estas')`;
  assertEquals(s1, se1);
});
Deno.test("decorator [next] sql", async () => {
  const conOptsX = self.structuredClone(conOpts);
  const db = new Connection(conOptsX);
  const dirname = path.dirname(path.fromFileUrl(import.meta.url));
  conOptsX.entities = [
    `${dirname}/playground/decorators/**/NextEntity.ts`,
  ];
  const s1 = (await sqlConnection(conOptsX)).join(";\n");
  const _metadata = getMetadata(conOptsX.name);
  await clearPlayground(db, _metadata.tables, _metadata.schemas);
  const se1 = `CREATE SCHEMA "decorator";
CREATE TABLE "decorator"."NextEntity1" ( "column1" SERIAL PRIMARY KEY, "column2" CHARACTER VARYING (100) NOT NULL );
INSERT INTO "decorator"."NextEntity1" ("column2") VALUES ( 'THIS A TEST' );
INSERT INTO "decorator"."NextEntity1" ("column2") VALUES ( 'THIS A ANOTHER TEST' )`;
  assertEquals(s1, se1);
});

Deno.test("decorator [afters] sql", async () => {
  const conOptsX = self.structuredClone(conOpts);
  const db = new Connection(conOptsX);
  const dirname = path.dirname(path.fromFileUrl(import.meta.url));
  conOptsX.entities = [
    `${dirname}/playground/decorators/**/AfterEntity.ts`,
  ];
  const s1 = (await sqlConnection(conOptsX)).join(";\n");
  const _metadata = getMetadata(conOptsX.name);
  await clearPlayground(db, _metadata.tables, _metadata.schemas);
  const se1 = `CREATE SCHEMA "decorator";
CREATE TABLE "decorator"."AfterEntity1" ( "column1" SERIAL PRIMARY KEY, "column2" CHARACTER VARYING (100) NOT NULL );
CREATE TABLE "decorator"."AfterEntity2" ( "column1" SERIAL PRIMARY KEY, "column2" CHARACTER VARYING (100) NOT NULL );
INSERT INTO "decorator"."AfterEntity1" ("column2") VALUES ( 'THIS A TEST' );
INSERT INTO "decorator"."AfterEntity1" ("column2") VALUES ( 'THIS A ANOTHER TEST' );
INSERT INTO "decorator"."AfterEntity2" ("column2") VALUES ( 'THIS A TEST' );
INSERT INTO "decorator"."AfterEntity2" ("column2") VALUES ( 'THIS A ANOTHER TEST' )`;
  assertEquals(s1, se1);
});
