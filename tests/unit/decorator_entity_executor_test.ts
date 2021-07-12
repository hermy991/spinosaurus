import { getTestConnection } from "./tool/tool.ts";
import { assert, assertEquals } from "deno/testing/asserts.ts";
import {
  /*Connection, */ createConnection,
  getMetadata,
} from "spinosaurus/mod.ts";
import * as path from "deno/path/mod.ts";

const conOpts = getTestConnection();

const testMessage = "  {}";

Deno.test(
  testMessage.replace(/\{\}/ig, "decorator entity should work"),
  async () => {
    const conOptsX = JSON.parse(JSON.stringify(conOpts));
    // const __filename = path.fromFileUrl(import.meta.url);
    const dirname = path.dirname(path.fromFileUrl(import.meta.url));

    // console.log(`\n__filename`, __filename);
    // console.log(`__dirname`, __dirname);

    // conX.entities = [new URL(".", import.meta.url).pathname + "playground/decorators/user.entity.ts"];
    conOptsX.entities = [`${dirname}/playground/decorators/**/Entity*.ts`];

    const conn = await createConnection(conOptsX);
    const _metadata = getMetadata();

    for (const table of _metadata.tables) {
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

    for (const table of _metadata.tables) {
      const co = await conn.checkObject(table.mixeds);
      if (co.exists) {
        await conn.drop({ entity: co.name, schema: co.schema }).execute();
      }
    }

    // console.log(metadata);
    // console.log(`ColumnTest1 = `, new ColumnTest1());

    // console.log("\n");
    // console.log(`import.meta.url = `, import.meta.url);
    // console.log(`new URL("", import.meta.url).pathname = `, new URL("", import.meta.url).pathname);
    // console.log(`new URL(".", import.meta.url).pathname = `, new URL(".", import.meta.url).pathname);
    // console.log("import.meta.main : ", import.meta.main);
    // console.log("");

    //assertEquals(query, queryExpected);
  },
);