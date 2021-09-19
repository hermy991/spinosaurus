import { getTestConnection } from "./tool/tool.ts";
import { assertEquals } from "deno/testing/asserts.ts";
import { /*Connection, */ createConnection, getMetadata } from "spinosaurus/mod.ts";
import * as path from "deno/path/mod.ts";

const conOpts = getTestConnection();

Deno.test("decorator entity should work", async () => {
  const conOptsX = self.structuredClone(conOpts);
  const dirname = path.dirname(path.fromFileUrl(import.meta.url));
  conOptsX.entities = [`${dirname}/playground/decorators/**/Entity*.ts`];
  const conn = await createConnection(conOptsX);
  const metadata = getMetadata(conOptsX.name);
  for (const table of metadata.tables) {
    const {
      target, /*Class*/
      options, /*Decorator Options*/
      mixeds, /*Class And Decorator Union*/
    } = table;
    const co = await conn.checkObject(mixeds);
    /**
     * Decorator Options
     */
    if (options.name) {
      assertEquals(
        options.name,
        co.name,
        `Table name '${co.name}' should be created with decorator option '${options.name}', options.name option decorator`,
      );
    }
    if (options.schema) {
      assertEquals(
        options.schema,
        co.schema,
        `Table '${co.name}' should be created in schema '${options.schema}', options.schema option decorator`,
      );
    }
    /**
     * TODO: create a table in a selected database testing
     */
    if (options.database) {
      assertEquals(
        options.database,
        co.database,
        `Table '${co.name}' should be created in database '${options.database}', options.database option decorator`,
      );
    }
    if (!options.name) {
      assertEquals(
        target.name,
        co.name,
        `Table name '${co.name}' should be created with class name '${target.name}', target.name to table name`,
      );
    }
  }
  /**
   * DROPPING TABLES
   */
  for (const table of metadata.tables) {
    const co = await conn.checkObject(table.mixeds);
    if (co.exists) {
      await conn.drop({ entity: co.name, schema: co.schema }).execute();
    }
  }
  /**
   * DROPPING SCHEMAS
   */
  for (const schema of metadata.schemas) {
    await conn.drop({ schema: schema.name }).execute();
  }
});
