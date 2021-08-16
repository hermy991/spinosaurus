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

Deno.test("decorator [check] query", async () => {
  const conOptsX = self.structuredClone(conOpts);
  const db = new Connection(conOptsX);
  const dirname = path.dirname(path.fromFileUrl(import.meta.url));
  conOptsX.entities = [`${dirname}/playground/decorators/**/CheckEntity.ts`];
  let s1 = await queryConnection(conOptsX);
  s1 = (s1 || "").replace(/[ \n\t]+/ig, " ").trim();
  const _metadata = getMetadata(conOptsX.name);
  await clearPlayground(db, _metadata.tables, _metadata.schemas);
  const se1 = `CREATE SCHEMA "decorator";
CREATE TABLE "decorator"."CheckEntity1" ( "column1" SERIAL PRIMARY KEY, "column2" CHARACTER VARYING (100) NOT NULL );
ALTER TABLE "decorator"."CheckEntity1" ADD CONSTRAINT "CHK_decorator_CheckEntity1_cdd96d3cc73d1dbdaffa03cc6cd7339b" CHECK (LENGTH("column2") > 0);
ALTER TABLE "decorator"."CheckEntity1" ADD CONSTRAINT "CHK_CheckEntity1_column2_2" CHECK (LENGTH("column2") > 0)`
    .replaceAll(/[ \n\t]+/ig, " ");
  assertEquals(s1, se1);
});

Deno.test("decorator [unique] query", async () => {
  const conOptsX = self.structuredClone(conOpts);
  const db = new Connection(conOptsX);
  const dirname = path.dirname(path.fromFileUrl(import.meta.url));
  conOptsX.entities = [`${dirname}/playground/decorators/**/UniqueEntity.ts`];
  let s1 = await queryConnection(conOptsX);
  s1 = (s1 || "").replace(/[ \n\t]+/ig, " ").trim();
  const _metadata = getMetadata(conOptsX.name);
  await clearPlayground(db, _metadata.tables, _metadata.schemas);
  const se1 = `CREATE SCHEMA "decorator";
  CREATE TABLE "decorator"."UniqueEntity1" ( "column1" SERIAL PRIMARY KEY, "column2" CHARACTER VARYING (100) NOT NULL, "column3" CHARACTER VARYING (100) NOT NULL, "custom4" CHARACTER VARYING (100) NOT NULL, "custom5" CHARACTER VARYING (100) NOT NULL, "column6" CHARACTER VARYING (100) NOT NULL, "column7" CHARACTER VARYING (100) NOT NULL, "column8" CHARACTER VARYING (100) NOT NULL, "custom9" CHARACTER VARYING (100) NOT NULL, "custom10" CHARACTER VARYING (100) NOT NULL, "custom11" CHARACTER VARYING (100) NOT NULL );
  ALTER TABLE "decorator"."UniqueEntity1" ADD CONSTRAINT "UQ_decorator_UniqueEntity1_cdd96d3cc73d1dbdaffa03cc6cd7339b" UNIQUE ("column8");
  ALTER TABLE "decorator"."UniqueEntity1" ADD CONSTRAINT "UQ_decorator_UniqueEntity1_0b7e7dee87b1c3b98e72131173dfbbbf" UNIQUE ("custom11");
  ALTER TABLE "decorator"."UniqueEntity1" ADD CONSTRAINT "UQ_decorator_UniqueEntity1_0b24df25fe628797b3a50ae0724d2730" UNIQUE ("column6", "column7", "custom9", "custom10");
  ALTER TABLE "decorator"."UniqueEntity1" ADD CONSTRAINT "UQ_decorator_UniqueEntity1_f7947d50da7a043693a592b4db43b0a1" UNIQUE ("column2");
  ALTER TABLE "decorator"."UniqueEntity1" ADD CONSTRAINT "UQ_decorator_UniqueEntity1_8b9af1f7f76daf0f02bd9c48c4a2e3d0" UNIQUE ("column2", "column3");
  ALTER TABLE "decorator"."UniqueEntity1" ADD CONSTRAINT "UQ_decorator_UniqueEntity1_006d1236aee3f92b8322299796ba1989" UNIQUE ("column2", "column3", "custom4");
  ALTER TABLE "decorator"."UniqueEntity1" ADD CONSTRAINT "UQ_decorator_UniqueEntity1_b523ff8d1ced96cef9c86492e790c2fb" UNIQUE ("custom4", "custom5");
  ALTER TABLE "decorator"."UniqueEntity1" ADD CONSTRAINT "UQ_UniqueEntity1_1" UNIQUE ("column2");
  ALTER TABLE "decorator"."UniqueEntity1" ADD CONSTRAINT "UQ_UniqueEntity1_2" UNIQUE ("column2", "column3");
  ALTER TABLE "decorator"."UniqueEntity1" ADD CONSTRAINT "UQ_UniqueEntity1_3" UNIQUE ("column2", "column3", "custom4");
  ALTER TABLE "decorator"."UniqueEntity1" ADD CONSTRAINT "UQ_UniqueEntity1_4" UNIQUE ("custom4", "custom5")`
    .replaceAll(/[ \n\t]+/ig, " ").trim();
  assertEquals(s1, se1);
});

Deno.test("decorator [many-to-one] query", async () => {
  const conOptsX = self.structuredClone(conOpts);
  const db = new Connection(conOptsX);
  const dirname = path.dirname(path.fromFileUrl(import.meta.url));
  conOptsX.entities = [
    `${dirname}/playground/decorators/**/ManyToOneEntity.ts`,
  ];
  let s1 = await queryConnection(conOptsX);
  s1 = (s1 || "").replace(/[ \n\t]+/ig, " ").trim();
  const _metadata = getMetadata(conOptsX.name);
  await clearPlayground(db, _metadata.tables, _metadata.schemas);
  const se1 = `CREATE SCHEMA "decorator";
  CREATE TABLE "decorator"."UniqueEntity1" ( "column1" SERIAL PRIMARY KEY, "column2" CHARACTER VARYING (100) NOT NULL, "column3" CHARACTER VARYING (100) NOT NULL, "custom4" CHARACTER VARYING (100) NOT NULL, "custom5" CHARACTER VARYING (100) NOT NULL, "column6" CHARACTER VARYING (100) NOT NULL, "column7" CHARACTER VARYING (100) NOT NULL, "column8" CHARACTER VARYING (100) NOT NULL, "custom9" CHARACTER VARYING (100) NOT NULL, "custom10" CHARACTER VARYING (100) NOT NULL, "custom11" CHARACTER VARYING (100) NOT NULL );
  ALTER TABLE "decorator"."UniqueEntity1" ADD CONSTRAINT "UQ_decorator_UniqueEntity1_cdd96d3cc73d1dbdaffa03cc6cd7339b" UNIQUE ("column8");
  ALTER TABLE "decorator"."UniqueEntity1" ADD CONSTRAINT "UQ_decorator_UniqueEntity1_0b7e7dee87b1c3b98e72131173dfbbbf" UNIQUE ("custom11");
  ALTER TABLE "decorator"."UniqueEntity1" ADD CONSTRAINT "UQ_decorator_UniqueEntity1_0b24df25fe628797b3a50ae0724d2730" UNIQUE ("column6", "column7", "custom9", "custom10");
  ALTER TABLE "decorator"."UniqueEntity1" ADD CONSTRAINT "UQ_decorator_UniqueEntity1_f7947d50da7a043693a592b4db43b0a1" UNIQUE ("column2");
  ALTER TABLE "decorator"."UniqueEntity1" ADD CONSTRAINT "UQ_decorator_UniqueEntity1_8b9af1f7f76daf0f02bd9c48c4a2e3d0" UNIQUE ("column2", "column3");
  ALTER TABLE "decorator"."UniqueEntity1" ADD CONSTRAINT "UQ_decorator_UniqueEntity1_006d1236aee3f92b8322299796ba1989" UNIQUE ("column2", "column3", "custom4");
  ALTER TABLE "decorator"."UniqueEntity1" ADD CONSTRAINT "UQ_decorator_UniqueEntity1_b523ff8d1ced96cef9c86492e790c2fb" UNIQUE ("custom4", "custom5");
  ALTER TABLE "decorator"."UniqueEntity1" ADD CONSTRAINT "UQ_UniqueEntity1_1" UNIQUE ("column2");
  ALTER TABLE "decorator"."UniqueEntity1" ADD CONSTRAINT "UQ_UniqueEntity1_2" UNIQUE ("column2", "column3");
  ALTER TABLE "decorator"."UniqueEntity1" ADD CONSTRAINT "UQ_UniqueEntity1_3" UNIQUE ("column2", "column3", "custom4");
  ALTER TABLE "decorator"."UniqueEntity1" ADD CONSTRAINT "UQ_UniqueEntity1_4" UNIQUE ("custom4", "custom5")`
    .replaceAll(/[ \n\t]+/ig, " ").trim();
  assertEquals(s1, se1);
});
