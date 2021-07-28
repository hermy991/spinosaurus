import { fs } from "../../deps.ts";
import { getTestConnection } from "./tool/tool.ts";
import { assert, assertEquals } from "deno/testing/asserts.ts";
import { Connection, getMetadata, queryConnection } from "spinosaurus/mod.ts";
import * as path from "deno/path/mod.ts";

const conOpts = getTestConnection();

const testMessage = "  {}";

// Deno.test(
//   testMessage.replace(/\{\}/ig, "decorator column query"),
//   async () => {
//     const conOptsX = JSON.parse(JSON.stringify(conOpts));
//     const dirname = path.dirname(path.fromFileUrl(import.meta.url));
//     conOptsX.entities = [`${dirname}/playground/decorators/**/Column*.ts`];
//     const sql = await queryConnection(conOptsX);
//     console.log("sql: ", sql);
//   },
// );

Deno.test(
  testMessage.replace(/\{\}/ig, "decorator column adding columns query"),
  async () => {
    const conOptsX = JSON.parse(JSON.stringify(conOpts));
    const entity = "AddColumnTypes1";
    const schema = "decorator";
    const db = new Connection(conOptsX);
    const chk1 = await db.checkObject({ name: entity, schema });
    if (chk1.exists) {
      await db.drop({ entity }).execute();
    }
    const e1 = db.create({ schema, check: true });
    const e2 = db.create({ entity, schema }).columns({
      columnName: "string1",
      spitype: "bigint",
    });
    const csql = `${e1.getQuery()};${e2.getQuery()}`;
    await e1.execute();
    await e2.execute();
    const dirname = path.dirname(path.fromFileUrl(import.meta.url));
    conOptsX.entities = [`${dirname}/playground/decorators/**/AddColumn*.ts`];
    const sql = await queryConnection(conOptsX);
    const _metadata = getMetadata(conOptsX.name);
    /**
     * Dropping tables
     */
    console.log("DELETING table in 2nd test: ", _metadata.tables.length);
    for (const table of _metadata.tables) {
      const co = await db.checkObject(table.mixeds);
      if (co.exists) {
        const t = { entity: co.name, schema: co.schema };
        console.log("DELETING table in 2nd test: ", t);
        await db.drop(t).execute();
      }
    }
    /**
     * Dropping schemas
     */
    console.log("DELETING schema in 2nd test: ", _metadata.schemas.length);
    for (const schema of _metadata.schemas) {
      const cs = await db.checkSchema({ name: schema.name });
      if (cs.exists) {
        const t = { schema: cs.name, check: true };
        console.log("DELETING schema in 2nd test: ", t);
        await db.drop(t).execute();
      }
    }
    console.log("sql: ", csql + ";" + sql);
  },
);

Deno.test(
  testMessage.replace(/\{\}/ig, "decorator column modify columns query"),
  async () => {
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
    const csql = `${e1.getQuery()};${e2.getQuery()}`;
    await e1.execute();
    await e2.execute();
    const dirname = path.dirname(path.fromFileUrl(import.meta.url));
    conOptsX.entities = [`${dirname}/playground/decorators/**/ModColumn*.ts`];
    const sql = await queryConnection(conOptsX);
    const _metadata = getMetadata(conOptsX.name);
    /**
     * Dropping tables
     */
    console.log("DELETING table in 3nd test: ", _metadata.tables.length);
    for (const table of _metadata.tables) {
      const co = await db.checkObject(table.mixeds);
      console.log(
        "DELETING table in 3nd test show: ",
        table.mixeds,
        co,
      );
      if (co.exists) {
        const t = { entity: co.name, schema: co.schema };
        console.log("DELETING table in 3nd test: ", t);
        await db.drop(t).execute();
      }
    }
    /**
     * Dropping schemas
     */
    console.log("DELETING schema in 3nd test: ", _metadata.schemas.length);
    for (const schema of _metadata.schemas) {
      const cs = await db.checkSchema({ name: schema.name });
      if (cs.exists) {
        const t = { schema: cs.name, check: true };
        console.log("DELETING schema in 3nd test: ", t);
        await db.drop(t).execute();
      }
    }
    console.log("sql: ", csql + ";" + sql);
  },
);

// Deno.test(
//   testMessage.replace(
//     /\{\}/ig,
//     "decorator column dropping columns query",
//   ),
//   async () => {
//     const conOptsX = JSON.parse(JSON.stringify(conOpts));
//     const entity = "DroColumnTypes1";
//     const schema = "decorator";
//     const db = new Connection(conOptsX);
//     const chk1 = await db.checkObject({ name: entity, schema });
//     if (chk1.exists) {
//       await db.drop({ entity }).execute();
//     }
//     const e1 = db.create({ schema, check: true });
//     const e2 = db.create({ entity, schema })
//       .columns(
//         { columnName: "string1", spitype: "numeric" },
//         { columnName: "string2", spitype: "numeric" },
//         { columnName: "string3", spitype: "numeric" },
//         { columnName: "number1", spitype: "text" },
//         { columnName: "number2", spitype: "text" },
//         { columnName: "number3", spitype: "text" },
//         { columnName: "bigint1", spitype: "numeric" },
//         { columnName: "bigint2", spitype: "numeric" },
//         { columnName: "bigint3", spitype: "numeric" },
//         { columnName: "boolean1", spitype: "numeric" },
//         { columnName: "boolean2", spitype: "numeric" },
//         { columnName: "boolean3", spitype: "numeric" },
//         { columnName: "timestamp1", spitype: "text" },
//         { columnName: "timestamp2", spitype: "text" },
//         { columnName: "timestamp3", spitype: "text" },
//         { columnName: "arraybuffer1", spitype: "text" },
//         { columnName: "arraybuffer2", spitype: "text" },
//         { columnName: "arraybuffer3", spitype: "text" },
//         { columnName: "blob1", spitype: "text" },
//         { columnName: "blob2", spitype: "text" },
//         { columnName: "blob3", spitype: "text" },
//       );
//     const csql = `${e1.getQuery()};${e2.getQuery()}`;
//     await e1.execute();
//     await e2.execute();

//     const dirname = path.dirname(path.fromFileUrl(import.meta.url));
//     conOptsX.entities = [`${dirname}/playground/decorators/**/DroColumn*.ts`];
//     const sql = await queryConnection(conOptsX);
//     const _metadata = getMetadata(conOptsX.name);
//     /**
//      * Dropping tables
//      */
//     for (const table of _metadata.tables) {
//       const co = await db.checkObject(table.mixeds);
//       if (co.exists) {
//         const t = { entity: co.name, schema: co.schema };
//         console.log("DELETING table in 4nd test: ", t);
//         await db.drop(t).execute();
//       }
//     }
//     /**
//      * Dropping schemas
//      */
//     for (const schema of _metadata.schemas) {
//       const cs = await db.checkSchema({ name: schema.name });
//       if (cs.exists) {
//         const t = { schema: cs.name, check: true };
//         console.log("DELETING schema in 4nd test: ", t);
//         await db.drop(t).execute();
//       }
//     }
//     console.log("sql: ", csql + ";" + sql);
//   },
// );
