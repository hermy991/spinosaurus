import { getTestConnection } from "./tool/tool.ts";
import { assertEquals } from "deno/testing/asserts.ts";
import {
  Connection,
  // createConnection,
  getMetadata,
  queryConnection,
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
  const s1 = (await queryConnection(conOptsX)).join(";\n");
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
  const s1 = (await queryConnection(conOptsX)).join(";\n");
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
ALTER TABLE "decorator"."UniqueEntity1" ADD CONSTRAINT "UQ_UniqueEntity1_4" UNIQUE ("custom4", "custom5")`;
  assertEquals(s1, se1);
});

Deno.test("decorator [many-to-one] sql", async () => {
  const conOptsX = self.structuredClone(conOpts);
  const db = new Connection(conOptsX);
  const dirname = path.dirname(path.fromFileUrl(import.meta.url));
  conOptsX.entities = [
    `${dirname}/playground/decorators/**/ManyToOneEntity.ts`,
  ];
  const s1 = (await queryConnection(conOptsX)).join(";\n");
  const _metadata = getMetadata(conOptsX.name);
  await clearPlayground(db, _metadata.tables, _metadata.schemas);
  const se1 = `CREATE SCHEMA "decorator";
CREATE TABLE "decorator"."ManyToOneEntity1" ( "column21" SERIAL PRIMARY KEY, "column22" CHARACTER VARYING (100) NOT NULL );
CREATE TABLE "decorator"."ManyToOneEntity3" ( "column11" SERIAL PRIMARY KEY, "column12" CHARACTER VARYING (100) NOT NULL );
CREATE TABLE "decorator"."ManyToOneEntity2" ( "column1" SERIAL PRIMARY KEY, "column2" CHARACTER VARYING (100) NOT NULL, "ManyToOneEntity3_column11_1" INTEGER NOT NULL, "ManyToOneEntity3_column11_2" INTEGER, "column11" INTEGER NOT NULL, "ManyToOneEntity3_column11_3" INTEGER NOT NULL, "ManyToOneEntity1_column21" INTEGER NOT NULL );
ALTER TABLE "decorator"."ManyToOneEntity2" ADD CONSTRAINT "FK_decorator_ManyToOneEntity2_ManyToOneEntity3_cdd96d" FOREIGN KEY ("ManyToOneEntity3_column11_1") REFERENCES "decorator"."ManyToOneEntity3" ("column11");
ALTER TABLE "decorator"."ManyToOneEntity2" ADD CONSTRAINT "FK_decorator_ManyToOneEntity2_ManyToOneEntity3_0b7e7d" FOREIGN KEY ("ManyToOneEntity3_column11_2") REFERENCES "decorator"."ManyToOneEntity3" ("column11");
ALTER TABLE "decorator"."ManyToOneEntity2" ADD CONSTRAINT "FK_decorator_ManyToOneEntity2_ManyToOneEntity3_0b24df" FOREIGN KEY ("column11") REFERENCES "decorator"."ManyToOneEntity3" ("column11");
ALTER TABLE "decorator"."ManyToOneEntity2" ADD CONSTRAINT "FK_ManyToOneEntity2_primary_ID" FOREIGN KEY ("ManyToOneEntity3_column11_3") REFERENCES "decorator"."ManyToOneEntity3" ("column11");
ALTER TABLE "decorator"."ManyToOneEntity2" ADD CONSTRAINT "FK_decorator_ManyToOneEntity2_ManyToOneEntity1_8b9af1" FOREIGN KEY ("ManyToOneEntity1_column21") REFERENCES "decorator"."ManyToOneEntity1" ("column21")`;
  assertEquals(s1, se1);
});

Deno.test("decorator [one-to-one] sql", async () => {
  const conOptsX = self.structuredClone(conOpts);
  const db = new Connection(conOptsX);
  const dirname = path.dirname(path.fromFileUrl(import.meta.url));
  conOptsX.entities = [
    `${dirname}/playground/decorators/**/OneToOneEntity.ts`,
  ];
  const s1 = (await queryConnection(conOptsX)).join(";\n");
  const _metadata = getMetadata(conOptsX.name);
  await clearPlayground(db, _metadata.tables, _metadata.schemas);
  const se1 = `CREATE SCHEMA "decorator";
CREATE TABLE "decorator"."OneToOneEntity1" ( "column21" SERIAL PRIMARY KEY, "column22" CHARACTER VARYING (100) NOT NULL );
CREATE TABLE "decorator"."OneToOneEntity3" ( "column11" SERIAL PRIMARY KEY, "column12" CHARACTER VARYING (100) NOT NULL );
CREATE TABLE "decorator"."OneToOneEntity2" ( "column1" SERIAL PRIMARY KEY, "column2" CHARACTER VARYING (100) NOT NULL, "OneToOneEntity3_column11_1" INTEGER NOT NULL, "OneToOneEntity3_column11_2" INTEGER, "column11" INTEGER NOT NULL, "OneToOneEntity3_column11_3" INTEGER NOT NULL, "OneToOneEntity1_column21_1" INTEGER NOT NULL, "OneToOneEntity1_column21_2" INTEGER NOT NULL );
ALTER TABLE "decorator"."OneToOneEntity2" ADD CONSTRAINT "UQ_decorator_OneToOneEntity2_cdd96d" UNIQUE ("OneToOneEntity3_column11_1");
ALTER TABLE "decorator"."OneToOneEntity2" ADD CONSTRAINT "UQ_decorator_OneToOneEntity2_0b7e7d" UNIQUE ("OneToOneEntity3_column11_2");
ALTER TABLE "decorator"."OneToOneEntity2" ADD CONSTRAINT "UQ_decorator_OneToOneEntity2_0b24df" UNIQUE ("column11");
ALTER TABLE "decorator"."OneToOneEntity2" ADD CONSTRAINT "UQ_decorator_OneToOneEntity2_f7947d" UNIQUE ("OneToOneEntity3_column11_3");
ALTER TABLE "decorator"."OneToOneEntity2" ADD CONSTRAINT "UQ_decorator_OneToOneEntity2_8b9af1" UNIQUE ("OneToOneEntity1_column21_1");
ALTER TABLE "decorator"."OneToOneEntity2" ADD CONSTRAINT "UQ_decorator_OneToOneEntity2_006d12" UNIQUE ("OneToOneEntity1_column21_2");
ALTER TABLE "decorator"."OneToOneEntity2" ADD CONSTRAINT "FK_decorator_OneToOneEntity2_OneToOneEntity3_cdd96d" FOREIGN KEY ("OneToOneEntity3_column11_1") REFERENCES "decorator"."OneToOneEntity3" ("column11");
ALTER TABLE "decorator"."OneToOneEntity2" ADD CONSTRAINT "FK_decorator_OneToOneEntity2_OneToOneEntity3_0b7e7d" FOREIGN KEY ("OneToOneEntity3_column11_2") REFERENCES "decorator"."OneToOneEntity3" ("column11");
ALTER TABLE "decorator"."OneToOneEntity2" ADD CONSTRAINT "FK_decorator_OneToOneEntity2_OneToOneEntity3_0b24df" FOREIGN KEY ("column11") REFERENCES "decorator"."OneToOneEntity3" ("column11");
ALTER TABLE "decorator"."OneToOneEntity2" ADD CONSTRAINT "FK_OneToOneEntity2_primary_ID" FOREIGN KEY ("OneToOneEntity3_column11_3") REFERENCES "decorator"."OneToOneEntity3" ("column11");
ALTER TABLE "decorator"."OneToOneEntity2" ADD CONSTRAINT "FK_decorator_OneToOneEntity2_OneToOneEntity1_8b9af1" FOREIGN KEY ("OneToOneEntity1_column21_1") REFERENCES "decorator"."OneToOneEntity1" ("column21");
ALTER TABLE "decorator"."OneToOneEntity2" ADD CONSTRAINT "FK_decorator_OneToOneEntity2_OneToOneEntity1_006d12" FOREIGN KEY ("OneToOneEntity1_column21_2") REFERENCES "decorator"."OneToOneEntity1" ("column21")`;
  assertEquals(s1, se1);
});
Deno.test("decorator [inherit] sql", async () => {
  const conOptsX = self.structuredClone(conOpts);
  const db = new Connection(conOptsX);
  const dirname = path.dirname(path.fromFileUrl(import.meta.url));
  conOptsX.entities = [
    `${dirname}/playground/decorators/**/DerivedEntity.ts`,
  ];
  const s1 = (await queryConnection(conOptsX)).join(";\n");
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
  const s1 = (await queryConnection(conOptsX)).join(";\n");
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
  const s1 = (await queryConnection(conOptsX)).join(";\n");
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
  const s1 = (await queryConnection(conOptsX)).join(";\n");
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
