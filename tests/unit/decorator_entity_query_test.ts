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
