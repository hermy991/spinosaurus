import { getTestConnection } from "./tool/tool.ts";
import { assertEquals } from "deno/testing/asserts.ts";
import { Connection, getMetadata, sqlConnection } from "spinosaurus/mod.ts";
import * as path from "deno/path/mod.ts";

async function clearPlayground(
  db: any,
  tables: Array<any>,
  schemas: Array<any>,
) {
  /**
   * Dropping tables
   */
  for (const table of tables.reverse()) {
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

Deno.test("decorator [column] sql", async () => {
  const conOptsX = self.structuredClone(conOpts);
  const dirname = path.dirname(path.fromFileUrl(import.meta.url));
  conOptsX.entities = [`${dirname}/playground/decorators/**/Column*.ts`];
  const sql = (await sqlConnection(conOptsX)).join(";\n");
  const sqlSpected =
    `CREATE TABLE "public"."ColumnOptions1" ( "varchar1" CHARACTER VARYING (100) DEFAULT '' NOT NULL, "text1" CHARACTER VARYING (100) DEFAULT '' NOT NULL, "numeric1" NUMERIC (15,4) DEFAULT 0 NOT NULL, "numeric2" NUMERIC (15) DEFAULT 0 NOT NULL, "numeric3" BIGINT DEFAULT 0 NOT NULL, "numeric4" INTEGER DEFAULT 0 NOT NULL, "numeric5" SMALLINT DEFAULT 0 NOT NULL, "integer1" NUMERIC DEFAULT 0 NOT NULL, "integer2" NUMERIC DEFAULT 0 NOT NULL, "boolean2" BOOLEAN DEFAULT '0' NOT NULL, "bigint1" BIGINT DEFAULT NULL NOT NULL );
CREATE TABLE "public"."ColumnTypes1" ( "string1" TEXT DEFAULT '' NOT NULL, "string2" TEXT NOT NULL, "string3" TEXT DEFAULT '' NOT NULL, "number1" NUMERIC DEFAULT 100 NOT NULL, "number2" NUMERIC NOT NULL, "number3" NUMERIC DEFAULT 100 NOT NULL, "bigint1" BIGINT DEFAULT NULL NOT NULL, "bigint2" BIGINT NOT NULL, "bigint3" BIGINT DEFAULT NULL NOT NULL, "boolean1" BOOLEAN DEFAULT '1' NOT NULL, "boolean2" BOOLEAN NOT NULL, "boolean3" BOOLEAN DEFAULT '1' NOT NULL, "timestamp1" TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL, "timestamp2" TIMESTAMP WITHOUT TIME ZONE NOT NULL, "timestamp3" TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL, "arraybuffer1" BYTEA DEFAULT NULL NOT NULL, "arraybuffer2" BYTEA NOT NULL, "arraybuffer3" BYTEA DEFAULT NULL NOT NULL, "blob1" BYTEA DEFAULT NULL NOT NULL, "blob2" BYTEA NOT NULL, "blob3" BYTEA DEFAULT NULL NOT NULL )`;
  assertEquals(sql, sqlSpected);
});

Deno.test("decorator [column adding columns] sql", async () => {
  const conOptsX = self.structuredClone(conOpts);
  const db = new Connection(conOptsX);
  const entity = "AddColumnTypes1";
  const schema = "decorator";
  const chk1 = await db.checkObject({ name: entity, schema });
  if (chk1.exists) {
    await db.drop({ entity }).execute();
  }
  const e1 = db.create({ schema, check: true });
  const e2 = db.create({ entity, schema }).columns([
    { name: "string1", spitype: "bigint" },
  ]);
  await e1.execute();
  await e2.execute();
  const dirname = path.dirname(path.fromFileUrl(import.meta.url));
  conOptsX.entities = [`${dirname}/playground/decorators/**/AddColumn*.ts`];
  const sql = (await sqlConnection(conOptsX)).join(";\n");
  const _metadata = getMetadata(conOptsX.name);
  await clearPlayground(db, _metadata.tables, _metadata.schemas);
  const sqlSpected = `ALTER TABLE "decorator"."AddColumnTypes1" ADD COLUMN "string2" TEXT NOT NULL DEFAULT '';
ALTER TABLE "decorator"."AddColumnTypes1" ADD COLUMN "string3" TEXT NOT NULL;
ALTER TABLE "decorator"."AddColumnTypes1" ADD COLUMN "string4" TEXT NOT NULL DEFAULT '';
ALTER TABLE "decorator"."AddColumnTypes1" ADD COLUMN "number1" NUMERIC NOT NULL DEFAULT 100;
ALTER TABLE "decorator"."AddColumnTypes1" ADD COLUMN "number2" NUMERIC NOT NULL;
ALTER TABLE "decorator"."AddColumnTypes1" ADD COLUMN "number3" NUMERIC NOT NULL DEFAULT 100;
ALTER TABLE "decorator"."AddColumnTypes1" ADD COLUMN "bigint1" BIGINT NOT NULL DEFAULT NULL;
ALTER TABLE "decorator"."AddColumnTypes1" ADD COLUMN "bigint2" BIGINT NOT NULL;
ALTER TABLE "decorator"."AddColumnTypes1" ADD COLUMN "bigint3" BIGINT NOT NULL DEFAULT NULL;
ALTER TABLE "decorator"."AddColumnTypes1" ADD COLUMN "boolean1" BOOLEAN NOT NULL DEFAULT '1';
ALTER TABLE "decorator"."AddColumnTypes1" ADD COLUMN "boolean2" BOOLEAN NOT NULL;
ALTER TABLE "decorator"."AddColumnTypes1" ADD COLUMN "boolean3" BOOLEAN NOT NULL DEFAULT '1';
ALTER TABLE "decorator"."AddColumnTypes1" ADD COLUMN "timestamp1" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now();
ALTER TABLE "decorator"."AddColumnTypes1" ADD COLUMN "timestamp2" TIMESTAMP WITHOUT TIME ZONE NOT NULL;
ALTER TABLE "decorator"."AddColumnTypes1" ADD COLUMN "timestamp3" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now();
ALTER TABLE "decorator"."AddColumnTypes1" ADD COLUMN "arraybuffer1" BYTEA NOT NULL DEFAULT NULL;
ALTER TABLE "decorator"."AddColumnTypes1" ADD COLUMN "arraybuffer2" BYTEA NOT NULL;
ALTER TABLE "decorator"."AddColumnTypes1" ADD COLUMN "arraybuffer3" BYTEA NOT NULL DEFAULT NULL;
ALTER TABLE "decorator"."AddColumnTypes1" ADD COLUMN "blob1" BYTEA NOT NULL DEFAULT NULL;
ALTER TABLE "decorator"."AddColumnTypes1" ADD COLUMN "blob2" BYTEA NOT NULL;
ALTER TABLE "decorator"."AddColumnTypes1" ADD COLUMN "blob3" BYTEA NOT NULL DEFAULT NULL;
ALTER TABLE "decorator"."AddColumnTypes1" DROP COLUMN "string1"`;
  assertEquals(sql, sqlSpected);
});

Deno.test("decorator [column modify columns] sql", async () => {
  const conOptsX = self.structuredClone(conOpts);
  const entity = "ModColumnTypes1";
  const schema = "decorator";
  const db = new Connection(conOptsX);
  const chk1 = await db.checkObject({ name: entity, schema });
  if (chk1.exists) {
    await db.drop({ entity }).execute();
  }

  const e1 = db.create({ schema, check: true });
  const e2 = db.create({ entity, schema })
    .columns([
      { name: "string1", spitype: "numeric" },
      { name: "string2", spitype: "numeric" },
      { name: "string3", spitype: "numeric" },
      { name: "number1", spitype: "text" },
      { name: "number2", spitype: "text" },
      { name: "number3", spitype: "text" },
      { name: "bigint1", spitype: "numeric" },
      { name: "bigint2", spitype: "numeric" },
      { name: "bigint3", spitype: "numeric" },
      { name: "boolean1", spitype: "numeric" },
      { name: "boolean2", spitype: "numeric" },
      { name: "boolean3", spitype: "numeric" },
      { name: "timestamp1", spitype: "text" },
      { name: "timestamp2", spitype: "text" },
      { name: "timestamp3", spitype: "text" },
      { name: "arraybuffer1", spitype: "text" },
      { name: "arraybuffer2", spitype: "text" },
      { name: "arraybuffer3", spitype: "text" },
      { name: "blob1", spitype: "text" },
      { name: "blob2", spitype: "text" },
      { name: "blob3", spitype: "text" },
    ]);
  // const csql = `${e1.getSqls()};${e2.getSqls()}`;
  await e1.execute();
  await e2.execute();
  const dirname = path.dirname(path.fromFileUrl(import.meta.url));
  conOptsX.entities = [`${dirname}/playground/decorators/**/ModColumn*.ts`];
  const sql = (await sqlConnection(conOptsX)).join(";\n");
  const _metadata = getMetadata(conOptsX.name);
  await clearPlayground(db, _metadata.tables, _metadata.schemas);
  const sqlSpected = `ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "string1" TYPE TEXT;
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "string1" SET NOT NULL;
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "string1" DROP DEFAULT;
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "string2" TYPE TEXT;
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "string2" SET NOT NULL;
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "string3" TYPE TEXT;
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "string3" SET NOT NULL;
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "string3" DROP DEFAULT;
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "number1" TYPE NUMERIC USING ("number1")::numeric;
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "number1" SET NOT NULL;
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "number1" SET DEFAULT 100;
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "number2" TYPE NUMERIC USING ("number2")::numeric;
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "number2" SET NOT NULL;
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "number3" TYPE NUMERIC USING ("number3")::numeric;
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "number3" SET NOT NULL;
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "number3" SET DEFAULT 100;
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "bigint1" TYPE BIGINT;
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "bigint1" SET NOT NULL;
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "bigint2" TYPE BIGINT;
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "bigint2" SET NOT NULL;
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "bigint3" TYPE BIGINT;
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "bigint3" SET NOT NULL;
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "boolean1" TYPE BOOLEAN USING ("boolean1")::int::boolean;
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "boolean1" SET NOT NULL;
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "boolean1" SET DEFAULT '1';
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "boolean2" TYPE BOOLEAN USING ("boolean2")::int::boolean;
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "boolean2" SET NOT NULL;
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "boolean3" TYPE BOOLEAN USING ("boolean3")::int::boolean;
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "boolean3" SET NOT NULL;
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "boolean3" SET DEFAULT '1';
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "timestamp1" TYPE TIMESTAMP WITHOUT TIME ZONE USING ("timestamp1")::timestamp without time zone;
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "timestamp1" SET NOT NULL;
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "timestamp1" SET DEFAULT now();
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "timestamp2" TYPE TIMESTAMP WITHOUT TIME ZONE USING ("timestamp2")::timestamp without time zone;
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "timestamp2" SET NOT NULL;
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "timestamp3" TYPE TIMESTAMP WITHOUT TIME ZONE USING ("timestamp3")::timestamp without time zone;
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "timestamp3" SET NOT NULL;
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "timestamp3" SET DEFAULT now();
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "arraybuffer1" TYPE BYTEA USING ("arraybuffer1")::bytea;
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "arraybuffer1" SET NOT NULL;
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "arraybuffer2" TYPE BYTEA USING ("arraybuffer2")::bytea;
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "arraybuffer2" SET NOT NULL;
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "arraybuffer3" TYPE BYTEA USING ("arraybuffer3")::bytea;
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "arraybuffer3" SET NOT NULL;
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "blob1" TYPE BYTEA USING ("blob1")::bytea;
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "blob1" SET NOT NULL;
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "blob2" TYPE BYTEA USING ("blob2")::bytea;
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "blob2" SET NOT NULL;
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "blob3" TYPE BYTEA USING ("blob3")::bytea;
ALTER TABLE "decorator"."ModColumnTypes1" ALTER COLUMN "blob3" SET NOT NULL`;
  assertEquals(sql, sqlSpected);
});

Deno.test("decorator [column dropping columns] sql", async () => {
  const conOptsX = self.structuredClone(conOpts);
  const entity = "DroColumnTypes1";
  const schema = "decorator";
  const db = new Connection(conOptsX);
  const chk1 = await db.checkObject({ name: entity, schema });
  if (chk1.exists) {
    await db.drop({ entity }).execute();
  }
  const e1 = db.create({ schema, check: true });
  const e2 = db.create({ entity, schema })
    .columns([
      { name: "string1", spitype: "numeric" },
      { name: "string2", spitype: "numeric" },
      { name: "string3", spitype: "numeric" },
      { name: "number1", spitype: "text" },
      { name: "number2", spitype: "text" },
      { name: "number3", spitype: "text" },
      { name: "bigint1", spitype: "numeric" },
      { name: "bigint2", spitype: "numeric" },
      { name: "bigint3", spitype: "numeric" },
      { name: "boolean1", spitype: "numeric" },
      { name: "boolean2", spitype: "numeric" },
      { name: "boolean3", spitype: "numeric" },
      { name: "timestamp1", spitype: "text" },
      { name: "timestamp2", spitype: "text" },
      { name: "timestamp3", spitype: "text" },
      { name: "arraybuffer1", spitype: "text" },
      { name: "arraybuffer2", spitype: "text" },
      { name: "arraybuffer3", spitype: "text" },
      { name: "blob1", spitype: "text" },
      { name: "blob2", spitype: "text" },
      { name: "blob3", spitype: "text" },
    ]);
  // const csql = `${e1.getSqls()};${e2.getSqls()}`;
  await e1.execute();
  await e2.execute();

  const dirname = path.dirname(path.fromFileUrl(import.meta.url));
  conOptsX.entities = [`${dirname}/playground/decorators/**/DroColumn*.ts`];
  const sql = (await sqlConnection(conOptsX)).join(";\n");
  const _metadata = getMetadata(conOptsX.name);
  await clearPlayground(db, _metadata.tables, _metadata.schemas);
  const sqlSpected = `ALTER TABLE "decorator"."DroColumnTypes1" ALTER COLUMN "string1" TYPE TEXT;
ALTER TABLE "decorator"."DroColumnTypes1" ALTER COLUMN "string1" SET NOT NULL;
ALTER TABLE "decorator"."DroColumnTypes1" ALTER COLUMN "string1" DROP DEFAULT;
ALTER TABLE "decorator"."DroColumnTypes1" DROP COLUMN "string2", DROP COLUMN "string3", DROP COLUMN "number1", DROP COLUMN "number2", DROP COLUMN "number3", DROP COLUMN "bigint1", DROP COLUMN "bigint2", DROP COLUMN "bigint3", DROP COLUMN "boolean1", DROP COLUMN "boolean2", DROP COLUMN "boolean3", DROP COLUMN "timestamp1", DROP COLUMN "timestamp2", DROP COLUMN "timestamp3", DROP COLUMN "arraybuffer1", DROP COLUMN "arraybuffer2", DROP COLUMN "arraybuffer3", DROP COLUMN "blob1", DROP COLUMN "blob2", DROP COLUMN "blob3"`;
  assertEquals(sql, sqlSpected);
});

Deno.test("decorator [column many-to-one] sql", async () => {
  const conOptsX = self.structuredClone(conOpts);
  const db = new Connection(conOptsX);
  const dirname = path.dirname(path.fromFileUrl(import.meta.url));
  conOptsX.entities = [
    `${dirname}/playground/decorators/**/ManyToOneEntity.ts`,
  ];
  const s1 = (await sqlConnection(conOptsX)).join(";\n");
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
ALTER TABLE "decorator"."ManyToOneEntity2" ADD CONSTRAINT "FK_decorator_ManyToOneEntity2_ManyToOneEntity1_cdd96d" FOREIGN KEY ("ManyToOneEntity1_column21") REFERENCES "decorator"."ManyToOneEntity1" ("column21")`;
  assertEquals(s1, se1);
});

Deno.test("decorator [column many-to-one add, alter, drop] sql", async () => {
  const conOptsX = self.structuredClone(conOpts);
  const entity1 = "ManyToOneSync1";
  const entity2 = "ManyToOneSync3";
  const entity3 = "ManyToOneSync4";
  const schema = "decorator";
  const db = new Connection(conOptsX);
  const chk1 = await db.checkObject({ name: entity1, schema });
  const chk2 = await db.checkObject({ name: entity2, schema });
  const chk3 = await db.checkObject({ name: entity3, schema });
  if (chk3.exists) {
    await db.drop({ entity: entity3, schema, check: true }).execute();
  }
  if (chk2.exists) {
    await db.drop({ entity: entity2, schema, check: true }).execute();
  }
  if (chk1.exists) {
    await db.drop({ entity: entity1, schema, check: true }).execute();
  }
  await db.create({ schema, check: true }).execute();
  const e1 = db.create({ entity: entity1, schema })
    .columns([
      {
        name: "column11",
        spitype: "numeric",
        primary: true,
        autoIncrement: "increment",
      },
      { name: "column12", spitype: "varchar", length: 100, nullable: false },
    ]);
  const e2 = db.create({ entity: entity2, schema })
    .columns([
      {
        name: "column31",
        spitype: "numeric",
        primary: true,
        autoIncrement: "increment",
      },
      { name: "column32", spitype: "varchar", length: 100, nullable: false },
    ]);
  const e3 = db.create({ entity: entity3, schema })
    .columns([
      {
        name: "column1",
        spitype: "numeric",
        primary: true,
        autoIncrement: "increment",
      },
      { name: "column2", spitype: "varchar", length: 100, nullable: false },
      {
        name: "ManyToOneSync1_column11",
        spitype: "integer",
        nullable: false,
      },
      {
        name: "ManyToOneSync3_column31",
        spitype: "integer",
        nullable: false,
      },
      {
        name: "columnReference_ID",
        spitype: "integer",
        nullable: false,
      },
    ])
    .relations([{
      columns: ["ManyToOneSync1_column11"],
      parentSchema: "decorator",
      parentEntity: "ManyToOneSync1",
      parentColumns: ["column11"],
    }, {
      columns: ["ManyToOneSync3_column31"],
      parentSchema: "decorator",
      parentEntity: "ManyToOneSync3",
      parentColumns: ["column31"],
    }, {
      name: "FK_ContraintToModify",
      columns: ["columnReference_ID"],
      parentSchema: "decorator",
      parentEntity: "ManyToOneSync3",
      parentColumns: ["column31"],
    }]);
  await e1.execute();
  await e2.execute();
  await e3.execute();

  const dirname = path.dirname(path.fromFileUrl(import.meta.url));
  conOptsX.entities = [`${dirname}/playground/decorators/**/ManyToOneSync*.ts`];
  const sql = (await sqlConnection(conOptsX)).join(";\n");
  const _metadata = getMetadata(conOptsX.name);
  await clearPlayground(db, _metadata.tables, _metadata.schemas);
  const sqlSpected =
    `ALTER TABLE "decorator"."ManyToOneSync4" DROP CONSTRAINT "FK_decorator_ManyToOneSync4_ManyToOneSync3_0b7e7d";
ALTER TABLE "decorator"."ManyToOneSync4" ADD CONSTRAINT "FK_MyNewContranint" FOREIGN KEY ("ManyToOneSync3_column31") REFERENCES "decorator"."ManyToOneSync3" ("column31");
ALTER TABLE "decorator"."ManyToOneSync4" DROP CONSTRAINT "FK_ContraintToModify";
ALTER TABLE "decorator"."ManyToOneSync4" ADD CONSTRAINT "FK_ContraintToModify" FOREIGN KEY ("columnReference_ID") REFERENCES "decorator"."ManyToOneSync1" ("column11")`;
  assertEquals(sql, sqlSpected);
});

Deno.test("decorator [column one-to-one] sql", async () => {
  const conOptsX = self.structuredClone(conOpts);
  const db = new Connection(conOptsX);
  const dirname = path.dirname(path.fromFileUrl(import.meta.url));
  conOptsX.entities = [
    `${dirname}/playground/decorators/**/OneToOneEntity.ts`,
  ];
  const s1 = (await sqlConnection(conOptsX)).join(";\n");
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
ALTER TABLE "decorator"."OneToOneEntity2" ADD CONSTRAINT "FK_decorator_OneToOneEntity2_OneToOneEntity1_cdd96d" FOREIGN KEY ("OneToOneEntity1_column21_1") REFERENCES "decorator"."OneToOneEntity1" ("column21");
ALTER TABLE "decorator"."OneToOneEntity2" ADD CONSTRAINT "FK_decorator_OneToOneEntity2_OneToOneEntity1_0b7e7d" FOREIGN KEY ("OneToOneEntity1_column21_2") REFERENCES "decorator"."OneToOneEntity1" ("column21")`;
  assertEquals(s1, se1);
});
