import * as path from "deno/path/mod.ts";
import * as luxon from "luxon/mod.ts";
import { assert, assertEquals, assertStringIncludes } from "deno/testing/asserts.ts";
import { clearPlayground, getTestConnection } from "./tool/tool.ts";
import { Connection, createConnection, getMetadata } from "spinosaurus/mod.ts";

const con1 = getTestConnection();

Deno.test("logging [options true] sql", async () => {
  const con1x = self.structuredClone(con1);
  const db = new Connection({ ...con1x, logging: true });
  const l1 = db.getLogging();
  if (l1) {
    let lines: string[] = [];
    function log(line: string, options?: any) {
      lines.push(line);
    }
    l1.setLogChannel(log);
    lines = [];
    await db.create({ schema: `logging`, check: true }).execute();
    const step1 = lines.join(";\n");
    await db.create({ schema: `logging`, entity: `User` }).columns([{
      name: "column1",
      length: 100,
      spitype: "varchar",
    }]).execute();
    const step2 = lines.join(";\n");
    lines = [];
    await db.from({ schema: `logging`, entity: `User` }).getMany();
    const step3 = lines.join(";\n");
    lines = [];
    await db.drop({ schema: "logging", entity: "User" }).execute();
    const step4 = lines.join(";\n");
    lines = [];
    await db.drop({ schema: `logging`, check: true }).execute();
    const step5 = lines.join(";\n");
    assertStringIncludes(step1, `- SCHEMA`);
    assertStringIncludes(step1, `CREATE SCHEMA IF NOT EXISTS "logging"`);
    assertStringIncludes(step2, `- SCHEMA`);
    assertStringIncludes(step2, `CREATE TABLE "logging"."User" ( "column1" CHARACTER VARYING (100) )`);
    assertStringIncludes(step3, `- QUERY`);
    assertStringIncludes(step3, `SELECT "logging"."User".* FROM "logging"."User"`);
    assertStringIncludes(step4, `- SCHEMA`);
    assertStringIncludes(step4, `DROP TABLE "logging"."User"`);
    assertStringIncludes(step5, `- SCHEMA`);
    assertStringIncludes(step5, `DROP SCHEMA IF EXISTS "logging"`);
  }
});
Deno.test("logging [options default file] sql", async () => {
  const defaultFile = "./spinosaurus.log";
  const con1x = self.structuredClone(con1);
  const db = new Connection({ ...con1x, logging: "{DEFAULT_FILE}" });
  const l1 = db.getLogging();
  if (l1) {
    let lines: string[] = [];
    let defaultTextFile = "";
    function log(line: string, options?: any) {
      lines.push(line);
    }
    l1.setLogChannel(log);
    lines = [];
    await db.create({ schema: `logging`, check: true }).execute();
    const step1 = lines.join(";\n");
    await db.create({ schema: `logging`, entity: `User` }).columns([{
      name: "column1",
      length: 100,
      spitype: "varchar",
    }]).execute();
    const step2 = lines.join(";\n");
    lines = [];
    await db.from({ schema: `logging`, entity: `User` }).getMany();
    const step3 = lines.join(";\n");
    lines = [];
    await db.drop({ schema: "logging", entity: "User" }).execute();
    const step4 = lines.join(";\n");
    lines = [];
    await db.drop({ schema: `logging`, check: true }).execute();
    const step5 = lines.join(";\n");
    try {
      defaultTextFile = await Deno.readTextFile(defaultFile);
    } catch (err: any) {
      console.log("error", err);
      defaultTextFile = "";
    }
    if (defaultTextFile) {
      await Deno.remove(defaultFile);
    }
    assert(!!defaultTextFile, `${defaultFile} does not exist, defaultTextFile: ${defaultTextFile}`);
    assertStringIncludes(step1, `- SCHEMA`);
    assertStringIncludes(step1, `CREATE SCHEMA IF NOT EXISTS "logging"`);
    assertStringIncludes(step2, `- SCHEMA`);
    assertStringIncludes(step2, `CREATE TABLE "logging"."User" ( "column1" CHARACTER VARYING (100) )`);
    assertStringIncludes(step3, `- QUERY`);
    assertStringIncludes(step3, `SELECT "logging"."User".* FROM "logging"."User"`);
    assertStringIncludes(step4, `- SCHEMA`);
    assertStringIncludes(step4, `DROP TABLE "logging"."User"`);
    assertStringIncludes(step5, `- SCHEMA`);
    assertStringIncludes(step5, `DROP SCHEMA IF EXISTS "logging"`);
  }
});

Deno.test("logging [options schema] sql", async () => {
  const con1x = self.structuredClone(con1);
  const db = new Connection({ ...con1x, logging: ["schema"] });
  const l1 = db.getLogging();
  if (l1) {
    let lines: string[] = [];
    let step1, step2, step3;
    function log(line: string, options?: any) {
      lines.push(line);
    }
    l1.setLogChannel(log);
    await db.create({ schema: `logging`, check: true }).execute();
    await db.create({ schema: `logging`, entity: `User` }).columns([{ name: "column1", spitype: "varchar" }]).execute();
    step1 = lines.length;

    lines = [];
    await db.from({ schema: `logging`, entity: `User` }).getMany();
    step2 = lines.length;

    lines = [];
    await db.drop({ schema: "logging", entity: "User" }).execute();
    await db.drop({ schema: `logging`, check: true }).execute();
    step3 = lines.length;

    assertEquals(step1, 2);
    assertEquals(step2, 0);
    assertEquals(step3, 2);
  }
});

Deno.test("logging [options file] sql", async () => {
  const con1x = self.structuredClone(con1);
  const dirname = path.dirname(path.fromFileUrl(import.meta.url));
  con1x.entities = [`${dirname}/playground/decorators/**/LoggingEntity.ts`];
  const logging = {
    schema: "./logs/log-schema-{yyyy-MM-dd}.log",
    query: "./logs/log-query-{yyyy-MM-dd}.log",
  };
  const db = await createConnection({ ...con1x, logging });
  const _metadata = getMetadata(con1x.name);
  await clearPlayground(db, _metadata.tables.reverse(), _metadata.schemas);
  let schemaTextFile = "";
  let queryTextFile = "";
  const schemaFileName = logging.schema.replace("{yyyy-MM-dd}", luxon.DateTime.now().toFormat("yyyy-MM-dd"));
  const queryFileName = logging.query.replace("{yyyy-MM-dd}", luxon.DateTime.now().toFormat("yyyy-MM-dd"));
  try {
    schemaTextFile = await Deno.readTextFile(schemaFileName);
  } catch (err: any) {
    console.log("error", err);
    schemaTextFile = "";
  }
  try {
    queryTextFile = await Deno.readTextFile(queryFileName);
  } catch (err: any) {
    console.log("error", err);
    queryTextFile = "";
  }
  if (schemaTextFile || queryTextFile) {
    await Deno.remove("./logs", { recursive: true });
  }
  assert(!!schemaTextFile, `${schemaFileName} does not exist, schemaTextFile: ${schemaTextFile}`);
  assert(!!queryTextFile, `${queryFileName} does not exist, queryTextFile: ${queryTextFile}`);
});
