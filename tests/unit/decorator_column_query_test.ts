import { getTestConnection } from "./tool/tool.ts";
import { assertEquals } from "deno/testing/asserts.ts";
import { Connection, getMetadata, queryConnection } from "spinosaurus/mod.ts";
import * as path from "deno/path/mod.ts";
import * as luxon from "luxon/mod.ts";

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

Deno.test("decorator column query", async () => {
  const conOptsX = JSON.parse(JSON.stringify(conOpts));
  const dirname = path.dirname(path.fromFileUrl(import.meta.url));
  conOptsX.entities = [`${dirname}/playground/decorators/**/Column*.ts`];
  let sql = await queryConnection(conOptsX);
  sql = (sql || "").replace(/[ \n\t]+/ig, " ").trim();
  const sqlSpected =
    `CREATE TABLE "public"."ColumnOptions1" ( "varchar1" CHARACTER VARYING (100) DEFAULT '' NOT NULL, "text1" CHARACTER VARYING (100) DEFAULT '' NOT NULL, "numeric1" NUMERIC (15,4) DEFAULT 0 NOT NULL, "numeric2" NUMERIC (15) DEFAULT 0 NOT NULL, "numeric3" BIGINT DEFAULT 0 NOT NULL, "numeric4" INTEGER DEFAULT 0 NOT NULL, "numeric5" SMALLINT DEFAULT 0 NOT NULL, "integer1" NUMERIC DEFAULT 0 NOT NULL, "integer2" NUMERIC DEFAULT 0 NOT NULL, "boolean2" BOOLEAN DEFAULT '0' NOT NULL, "bigint1" BIGINT DEFAULT NULL NOT NULL ); CREATE TABLE "public"."ColumnTypes1" ( "string1" TEXT DEFAULT '' NOT NULL, "string2" TEXT NOT NULL, "string3" TEXT DEFAULT '' NOT NULL, "number1" NUMERIC DEFAULT 100 NOT NULL, "number2" NUMERIC NOT NULL, "number3" NUMERIC DEFAULT 100 NOT NULL, "bigint1" BIGINT DEFAULT NULL NOT NULL, "bigint2" BIGINT NOT NULL, "bigint3" BIGINT DEFAULT NULL NOT NULL, "boolean1" BOOLEAN DEFAULT '1' NOT NULL, "boolean2" BOOLEAN NOT NULL, "boolean3" BOOLEAN DEFAULT '1' NOT NULL, "timestamp1" TIMESTAMP DEFAULT TO_DATE('${
      luxon.DateTime.now().toFormat("yyyy-MM-dd")
    }', 'YYYY-MM-DD') NOT NULL, "timestamp2" TIMESTAMP NOT NULL, "timestamp3" TIMESTAMP DEFAULT TO_DATE('${
      luxon.DateTime.now().toFormat("yyyy-MM-dd")
    }', 'YYYY-MM-DD') NOT NULL, "arraybuffer1" BYTEA DEFAULT NULL NOT NULL, "arraybuffer2" BYTEA NOT NULL, "arraybuffer3" BYTEA DEFAULT NULL NOT NULL, "blob1" BYTEA DEFAULT NULL NOT NULL, "blob2" BYTEA NOT NULL, "blob3" BYTEA DEFAULT NULL NOT NULL )`;
  assertEquals(sql, sqlSpected);
});

Deno.test("decorator column adding columns query", async () => {
  const conOptsX = JSON.parse(JSON.stringify(conOpts));
  const db = new Connection(conOptsX);
  const entity = "AddColumnTypes1";
  const schema = "decorator";
  const chk1 = await db.checkObject({ name: entity, schema });
  if (chk1.exists) {
    await db.drop({ entity }).execute();
  }
  const e1 = db.create({ schema, check: true });
  const e2 = db.create({ entity, schema }).columns({
    columnName: "string1",
    spitype: "bigint",
  });
  // const csql = `${e1.getQuery()};${e2.getQuery()}`;
  await e1.execute();
  await e2.execute();
  const dirname = path.dirname(path.fromFileUrl(import.meta.url));
  conOptsX.entities = [`${dirname}/playground/decorators/**/AddColumn*.ts`];
  let sql = await queryConnection(conOptsX);
  const _metadata = getMetadata(conOptsX.name);
  await clearPlayground(db, _metadata.tables, _metadata.schemas);
  sql = (sql || "").replace(/[ \n\t]+/ig, " ").trim();
  const sqlSpected =
    `ALTER TABLE "decorator"."AddColumnTypes1" ADD COLUMN "string2" TEXT NOT NULL DEFAULT ''; ALTER TABLE "decorator"."AddColumnTypes1" ADD COLUMN "string3" TEXT NOT NULL; ALTER TABLE "decorator"."AddColumnTypes1" ADD COLUMN "string4" TEXT NOT NULL DEFAULT ''; ALTER TABLE "decorator"."AddColumnTypes1" ADD COLUMN "number1" NUMERIC NOT NULL DEFAULT 100; ALTER TABLE "decorator"."AddColumnTypes1" ADD COLUMN "number2" NUMERIC NOT NULL; ALTER TABLE "decorator"."AddColumnTypes1" ADD COLUMN "number3" NUMERIC NOT NULL DEFAULT 100; ALTER TABLE "decorator"."AddColumnTypes1" ADD COLUMN "bigint1" BIGINT NOT NULL DEFAULT NULL; ALTER TABLE "decorator"."AddColumnTypes1" ADD COLUMN "bigint2" BIGINT NOT NULL; ALTER TABLE "decorator"."AddColumnTypes1" ADD COLUMN "bigint3" BIGINT NOT NULL DEFAULT NULL; ALTER TABLE "decorator"."AddColumnTypes1" ADD COLUMN "boolean1" BOOLEAN NOT NULL DEFAULT '1'; ALTER TABLE "decorator"."AddColumnTypes1" ADD COLUMN "boolean2" BOOLEAN NOT NULL; ALTER TABLE "decorator"."AddColumnTypes1" ADD COLUMN "boolean3" BOOLEAN NOT NULL DEFAULT '1'; ALTER TABLE "decorator"."AddColumnTypes1" ADD COLUMN "timestamp1" TIMESTAMP NOT NULL DEFAULT TO_DATE('${
      luxon.DateTime.now().toFormat("yyyy-MM-dd")
    }', 'YYYY-MM-DD'); ALTER TABLE "decorator"."AddColumnTypes1" ADD COLUMN "timestamp2" TIMESTAMP NOT NULL; ALTER TABLE "decorator"."AddColumnTypes1" ADD COLUMN "timestamp3" TIMESTAMP NOT NULL DEFAULT TO_DATE('${
      luxon.DateTime.now().toFormat("yyyy-MM-dd")
    }', 'YYYY-MM-DD'); ALTER TABLE "decorator"."AddColumnTypes1" ADD COLUMN "arraybuffer1" BYTEA NOT NULL DEFAULT NULL; ALTER TABLE "decorator"."AddColumnTypes1" ADD COLUMN "arraybuffer2" BYTEA NOT NULL; ALTER TABLE "decorator"."AddColumnTypes1" ADD COLUMN "arraybuffer3" BYTEA NOT NULL DEFAULT NULL; ALTER TABLE "decorator"."AddColumnTypes1" ADD COLUMN "blob1" BYTEA NOT NULL DEFAULT NULL; ALTER TABLE "decorator"."AddColumnTypes1" ADD COLUMN "blob2" BYTEA NOT NULL; ALTER TABLE "decorator"."AddColumnTypes1" ADD COLUMN "blob3" BYTEA NOT NULL DEFAULT NULL; ALTER TABLE "decorator"."AddColumnTypes1" DROP COLUMN "string1"`;
  assertEquals(sql, sqlSpected);
});

Deno.test("decorator column modify columns query", async () => {
  const conOptsX = JSON.parse(JSON.stringify(conOpts));
  const entity = "ModColumnTypes1";
  const schema = "decorator";
  const db = new Connection(conOptsX);
  const chk1 = await db.checkObject({ name: entity, schema });
  if (chk1.exists) {
    await db.drop({ entity }).execute();
  }

  const e1 = db.create({ schema, check: true });
  const e2 = db.create({ entity, schema })
    .columns(
      { columnName: "string1", spitype: "numeric" },
      { columnName: "string2", spitype: "numeric" },
      { columnName: "string3", spitype: "numeric" },
      { columnName: "number1", spitype: "text" },
      { columnName: "number2", spitype: "text" },
      { columnName: "number3", spitype: "text" },
      { columnName: "bigint1", spitype: "numeric" },
      { columnName: "bigint2", spitype: "numeric" },
      { columnName: "bigint3", spitype: "numeric" },
      { columnName: "boolean1", spitype: "numeric" },
      { columnName: "boolean2", spitype: "numeric" },
      { columnName: "boolean3", spitype: "numeric" },
      { columnName: "timestamp1", spitype: "text" },
      { columnName: "timestamp2", spitype: "text" },
      { columnName: "timestamp3", spitype: "text" },
      { columnName: "arraybuffer1", spitype: "text" },
      { columnName: "arraybuffer2", spitype: "text" },
      { columnName: "arraybuffer3", spitype: "text" },
      { columnName: "blob1", spitype: "text" },
      { columnName: "blob2", spitype: "text" },
      { columnName: "blob3", spitype: "text" },
    );
  // const csql = `${e1.getQuery()};${e2.getQuery()}`;
  await e1.execute();
  await e2.execute();
  const dirname = path.dirname(path.fromFileUrl(import.meta.url));
  conOptsX.entities = [`${dirname}/playground/decorators/**/ModColumn*.ts`];
  let sql = await queryConnection(conOptsX);
  const _metadata = getMetadata(conOptsX.name);
  await clearPlayground(db, _metadata.tables, _metadata.schemas);
  sql = (sql || "").replace(/[ \n\t]+/ig, " ").trim();
  const sqlSpected =
    `ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "string1" TYPE TEXT; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "string1" SET NOT NULL; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "string1" DROP DEFAULT; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "string2" TYPE TEXT; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "string2" SET NOT NULL; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "string3" TYPE TEXT; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "string3" SET NOT NULL; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "string3" DROP DEFAULT; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "number1" TYPE NUMERIC USING ("number1")::numeric; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "number1" SET NOT NULL; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "number1" SET DEFAULT 100; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "number2" TYPE NUMERIC USING ("number2")::numeric; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "number2" SET NOT NULL; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "number3" TYPE NUMERIC USING ("number3")::numeric; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "number3" SET NOT NULL; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "number3" SET DEFAULT 100; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "bigint1" TYPE BIGINT; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "bigint1" SET NOT NULL; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "bigint1" SET DEFAULT NULL; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "bigint2" TYPE BIGINT; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "bigint2" SET NOT NULL; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "bigint3" TYPE BIGINT; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "bigint3" SET NOT NULL; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "bigint3" SET DEFAULT NULL; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "boolean1" TYPE BOOLEAN USING ("boolean1")::int::boolean; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "boolean1" SET NOT NULL; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "boolean1" SET DEFAULT '1'; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "boolean2" TYPE BOOLEAN USING ("boolean2")::int::boolean; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "boolean2" SET NOT NULL; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "boolean3" TYPE BOOLEAN USING ("boolean3")::int::boolean; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "boolean3" SET NOT NULL; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "boolean3" SET DEFAULT '1'; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "timestamp1" TYPE TIMESTAMP USING ("timestamp1")::timestamp without time zone; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "timestamp1" SET NOT NULL; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "timestamp1" SET DEFAULT TO_DATE('${
      luxon.DateTime.now().toFormat("yyyy-MM-dd")
    }', 'YYYY-MM-DD'); ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "timestamp2" TYPE TIMESTAMP USING ("timestamp2")::timestamp without time zone; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "timestamp2" SET NOT NULL; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "timestamp3" TYPE TIMESTAMP USING ("timestamp3")::timestamp without time zone; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "timestamp3" SET NOT NULL; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "timestamp3" SET DEFAULT TO_DATE('${
      luxon.DateTime.now().toFormat("yyyy-MM-dd")
    }', 'YYYY-MM-DD'); ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "arraybuffer1" TYPE BYTEA USING ("arraybuffer1")::bytea; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "arraybuffer1" SET NOT NULL; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "arraybuffer1" SET DEFAULT NULL; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "arraybuffer2" TYPE BYTEA USING ("arraybuffer2")::bytea; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "arraybuffer2" SET NOT NULL; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "arraybuffer3" TYPE BYTEA USING ("arraybuffer3")::bytea; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "arraybuffer3" SET NOT NULL; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "arraybuffer3" SET DEFAULT NULL; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "blob1" TYPE BYTEA USING ("blob1")::bytea; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "blob1" SET NOT NULL; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "blob1" SET DEFAULT NULL; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "blob2" TYPE BYTEA USING ("blob2")::bytea; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "blob2" SET NOT NULL; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "blob3" TYPE BYTEA USING ("blob3")::bytea; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "blob3" SET NOT NULL; ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "blob3" SET DEFAULT NULL`;
  assertEquals(sql, sqlSpected);
});

Deno.test("decorator column dropping columns query", async () => {
  const conOptsX = JSON.parse(JSON.stringify(conOpts));
  const entity = "DroColumnTypes1";
  const schema = "decorator";
  const db = new Connection(conOptsX);
  const chk1 = await db.checkObject({ name: entity, schema });
  if (chk1.exists) {
    await db.drop({ entity }).execute();
  }
  const e1 = db.create({ schema, check: true });
  const e2 = db.create({ entity, schema })
    .columns(
      { columnName: "string1", spitype: "numeric" },
      { columnName: "string2", spitype: "numeric" },
      { columnName: "string3", spitype: "numeric" },
      { columnName: "number1", spitype: "text" },
      { columnName: "number2", spitype: "text" },
      { columnName: "number3", spitype: "text" },
      { columnName: "bigint1", spitype: "numeric" },
      { columnName: "bigint2", spitype: "numeric" },
      { columnName: "bigint3", spitype: "numeric" },
      { columnName: "boolean1", spitype: "numeric" },
      { columnName: "boolean2", spitype: "numeric" },
      { columnName: "boolean3", spitype: "numeric" },
      { columnName: "timestamp1", spitype: "text" },
      { columnName: "timestamp2", spitype: "text" },
      { columnName: "timestamp3", spitype: "text" },
      { columnName: "arraybuffer1", spitype: "text" },
      { columnName: "arraybuffer2", spitype: "text" },
      { columnName: "arraybuffer3", spitype: "text" },
      { columnName: "blob1", spitype: "text" },
      { columnName: "blob2", spitype: "text" },
      { columnName: "blob3", spitype: "text" },
    );
  // const csql = `${e1.getQuery()};${e2.getQuery()}`;
  await e1.execute();
  await e2.execute();

  const dirname = path.dirname(path.fromFileUrl(import.meta.url));
  conOptsX.entities = [`${dirname}/playground/decorators/**/DroColumn*.ts`];
  let sql = await queryConnection(conOptsX);
  const _metadata = getMetadata(conOptsX.name);
  await clearPlayground(db, _metadata.tables, _metadata.schemas);
  sql = (sql || "").replace(/[ \n\t]+/ig, " ").trim();
  const sqlSpected =
    `ALTER TABLE "decorator"."DroColumnTypes1" ALTER COLUMN "string1" TYPE TEXT; ALTER TABLE "decorator"."DroColumnTypes1" ALTER COLUMN "string1" SET NOT NULL; ALTER TABLE "decorator"."DroColumnTypes1" ALTER COLUMN "string1" DROP DEFAULT; ALTER TABLE "decorator"."DroColumnTypes1" DROP COLUMN "string2", DROP COLUMN "string3", DROP COLUMN "number1", DROP COLUMN "number2", DROP COLUMN "number3", DROP COLUMN "bigint1", DROP COLUMN "bigint2", DROP COLUMN "bigint3", DROP COLUMN "boolean1", DROP COLUMN "boolean2", DROP COLUMN "boolean3", DROP COLUMN "timestamp1", DROP COLUMN "timestamp2", DROP COLUMN "timestamp3", DROP COLUMN "arraybuffer1", DROP COLUMN "arraybuffer2", DROP COLUMN "arraybuffer3", DROP COLUMN "blob1", DROP COLUMN "blob2", DROP COLUMN "blob3"`;
  assertEquals(sql, sqlSpected);
});
