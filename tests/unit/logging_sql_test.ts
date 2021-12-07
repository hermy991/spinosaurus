import * as fs from "deno/fs/mod.ts";
import * as path from "deno/path/mod.ts";
import * as luxon from "luxon/mod.ts";
import { assert, assertEquals, assertStringIncludes } from "deno/testing/asserts.ts";
import { clearPlayground, getTestConnection } from "./tool/tool.ts";
import { createConnection, getMetadata } from "spinosaurus/mod.ts";

const con1 = getTestConnection();

Deno.test("logging [options true] sql", async () => {
  const con1x = self.structuredClone(con1);
  const dirname = path.dirname(path.fromFileUrl(import.meta.url));
  con1x.entities = [`${dirname}/playground/decorators/**/LoggingEntity.ts`];
  const db = await createConnection({ ...con1x, logging: true });
  const _metadata = getMetadata(con1x.name);
  const l1 = db.getLogging();
  if (l1) {
    const lines: string[] = [];
    function log(line: string, options?: any) {
      lines.push(line);
    }
    l1.setLogChannel(log);
    await db.from({ schema: `logging`, entity: `LoggingEntity1` }).getMany();
    assertStringIncludes(lines.join(";\n"), `- QUERY`);
    assertStringIncludes(lines.join(";\n"), `LoggingEntity1`);
  }
  await clearPlayground(db, _metadata.tables.reverse(), _metadata.schemas);
  // assertEquals(q1, qe1);
});

Deno.test("logging [options schema] sql", async () => {
  const con1x = self.structuredClone(con1);
  const dirname = path.dirname(path.fromFileUrl(import.meta.url));
  con1x.entities = [`${dirname}/playground/decorators/**/LoggingEntity.ts`];
  const db = await createConnection({ ...con1x, logging: ["schema"] });
  const _metadata = getMetadata(con1x.name);
  const l1 = db.getLogging();
  if (l1) {
    const lines: string[] = [];
    function log(line: string, options?: any) {
      lines.push(line);
    }
    l1.setLogChannel(log);
    await db.from({ schema: `logging`, entity: `LoggingEntity1` }).getMany();
    assertEquals(lines.length, 0);

    await db.create({ schema: "logging", entity: "User" }).columns([{ name: "column1", spitype: "varchar" }]).execute();
    await db.drop({ schema: "logging", entity: "User" }).execute();

    assertEquals(lines.length, 2);
  }
  await clearPlayground(db, _metadata.tables.reverse(), _metadata.schemas);
  // assertEquals(q1, qe1);
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
  let schemaFile = false;
  let queryFile = false;
  try {
    schemaFile = await fs.exists(logging.schema.replace("{yyyy-MM-dd}", luxon.DateTime.now().toFormat("yyyy-MM-dd")));
    queryFile = await fs.exists(logging.query.replace("{yyyy-MM-dd}", luxon.DateTime.now().toFormat("yyyy-MM-dd")));
  } catch (err: any) {
    schemaFile = false;
    queryFile = false;
  }
  assert(schemaFile, `${logging.schema} does not exist`);
  assert(queryFile, `${logging.schema} does not exist`);
  await clearPlayground(db, _metadata.tables.reverse(), _metadata.schemas);
  if (schemaFile || queryFile) {
    await Deno.remove("./logs", { recursive: true });
  }
});
