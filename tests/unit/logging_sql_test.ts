import { assertEquals } from "deno/testing/asserts.ts";
import * as path from "deno/path/mod.ts";
import { clearPlayground, getTestConnection } from "./tool/tool.ts";
import { createConnection, getMetadata } from "spinosaurus/mod.ts";

const con1 = getTestConnection();

Deno.test("logging [config options] sql", async () => {
  const con1x = self.structuredClone(con1);
  const dirname = path.dirname(path.fromFileUrl(import.meta.url));
  con1x.entities = [`${dirname}/playground/decorators/**/LoggingEntity.ts`];
  const db = (await createConnection({ ...con1x, logging: true }));
  const _metadata = getMetadata(con1x.name);

  await clearPlayground(db, _metadata.tables.reverse(), _metadata.schemas);
  // assertEquals(q1, qe1);
});
