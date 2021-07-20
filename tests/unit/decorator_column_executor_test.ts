import { getTestConnection } from "./tool/tool.ts";
import { assert, assertEquals } from "deno/testing/asserts.ts";
import { Connection, createConnection, getMetadata } from "spinosaurus/mod.ts";
import * as path from "deno/path/mod.ts";

const conOpts = getTestConnection();

const testMessage = "  {}";

// Deno.test(
//   testMessage.replace(/\{\}/ig, "decorator column should work"),
//   async () => {
//     const conOptsX = JSON.parse(JSON.stringify(conOpts));
//     const dirname = path.dirname(path.fromFileUrl(import.meta.url));
//     conOptsX.entities = [`${dirname}/playground/decorators/**/Column*.ts`];
//     const conn = await createConnection(conOptsX);
//     const _metadata = getMetadata(conOptsX.name);

//     for (const table of _metadata.tables) {
//       let { database, schema, name } = table.mixeds;
//       schema = schema || "";
//       const query = `
// SELECT c.*
// FROM information_schema.columns c
// WHERE c.table_schema NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
//   AND c.table_schema = CASE WHEN '${schema}' = '' THEN current_schema() ELSE '${schema}' END -- schema
//   AND c.table_name IN ('${name}');
// `;
//       const cds = await conn.execute(query, { database });
//       for (const column of table.columns) {
//         const {
//           name: columnName,
//           spitype,
//           length,
//           nullable,
//           precision,
//           scale,
//         } = column.mixeds;
//         assert(
//           (cds.rows || []).some((x) => x.column_name === columnName),
//           `column '${columnName}' must to be created`,
//         );
//         if (nullable === true) {
//           assert(
//             (cds.rows || []).some((x) =>
//               x.column_name === columnName && x.is_nullable === "YES"
//             ),
//             `column '${columnName}' must to be null`,
//           );
//         }
//         if (nullable === false) {
//           assert(
//             (cds.rows || []).some((x) =>
//               x.column_name === columnName && x.is_nullable === "NO"
//             ),
//             `column '${columnName}' must be not null`,
//           );
//         }
//         if (precision) {
//           assert(
//             (cds.rows || []).some((x) =>
//               x.column_name === columnName && x.numeric_precision === precision
//             ),
//             `column '${columnName}' must has precision of '${precision}'`,
//           );
//         }
//         if (scale) {
//           assert(
//             (cds.rows || []).some((x) =>
//               x.column_name === columnName && x.numeric_scale === scale
//             ),
//             `column '${columnName}' must has scale of '${scale}'`,
//           );
//         }
//         if (spitype == "varchar" && length) {
//           assert(
//             (cds.rows || []).some((x) =>
//               x.column_name === columnName &&
//               x.character_maximum_length === length
//             ),
//             `column '${columnName}' must has length of '${length}'`,
//           );
//         }
//       }

//       const {
//         target, /*Class*/
//         options, /*Decorator Options*/
//         mixeds, /*Class And Decorator Union*/
//       } = table;
//       const co = await conn.checkObject(mixeds);
//       /**
//        * Decorator Options
//        */
//       if (options.name) {
//         assertEquals(
//           options.name,
//           co.name,
//           `Table name '${co.name}' should be created with decorator option '${options.name}', options.name option decorator`,
//         );
//       }
//       if (options.schema) {
//         assertEquals(
//           options.schema,
//           co.schema,
//           `Table '${co.name}' should be created in schema '${options.schema}', options.schema option decorator`,
//         );
//       }
//       /**
//        * TODO: create a table in a selected database testing
//        */
//       if (options.database) {
//         assertEquals(
//           options.database,
//           co.database,
//           `Table '${co.name}' should be created in database '${options.database}', options.database option decorator`,
//         );
//       }
//       if (!options.name) {
//         assertEquals(
//           target.name,
//           co.name,
//           `Table name '${co.name}' should be created with class name '${target.name}', target.name to table name`,
//         );
//       }
//     }
//     /**
//      * Dropping tables
//      */
//     for (const table of _metadata.tables) {
//       const co = await conn.checkObject(table.mixeds);
//       if (co.exists) {
//         await conn.drop({ entity: co.name, schema: co.schema }).execute();
//       }
//     }
//     /**
//      * Dropping schemas
//      */
//     for (const schema of _metadata.schemas) {
//       const cs = await conn.checkSchema({ name: schema.name });
//       if (cs.exists) {
//         await conn.drop({ schema: cs.name, check: true }).execute();
//       }
//     }
//   },
// );

Deno.test(
  testMessage.replace(/\{\}/ig, "decorator column in modification should work"),
  async () => {
    const conOptsX = JSON.parse(JSON.stringify(conOpts));
    const entity = "ModColumnTypes1";
    const db = new Connection(conOptsX);
    const chk1 = await db.checkObject({ name: entity, schema: "mod" });
    if (chk1.exists) {
      await db.drop({ entity });
    }
    await db.create({ schema: "mod", check: true })
      .execute();
    await db.create({ entity, schema: "mod" })
      .columns({ columnName: "string1", spitype: "bigint" })
      .execute();

    const dirname = path.dirname(path.fromFileUrl(import.meta.url));
    conOptsX.entities = [`${dirname}/playground/decorators/**/ModColumn*.ts`];
    const conn = await createConnection(conOptsX);
    const _metadata = getMetadata(conOptsX.name);

    for (const table of _metadata.tables) {
      let { database, schema, name } = table.mixeds;
      schema = schema || "";
      const query = `
SELECT c.*
FROM information_schema.columns c 
WHERE c.table_schema NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
  AND c.table_schema = CASE WHEN '${schema}' = '' THEN current_schema() ELSE '${schema}' END -- schema
  AND c.table_name IN ('${name}');
`;
      const cds = await conn.execute(query, { database });
      for (const column of table.columns) {
        const {
          name: columnName,
          spitype,
          // length,
          // nullable,
          // precision,
          // scale,
        } = column.mixeds;
        if (columnName === "string1") {
          assert(
            (cds.rows || []).some((x) =>
              x.column_name === columnName && x.data_type === "text" &&
              spitype === "text"
            ),
            `column '${columnName}' must to be text type`,
          );
        }
      }
    }
    // /**
    //  * Dropping tables
    //  */
    // for (const table of _metadata.tables) {
    //   const co = await conn.checkObject(table.mixeds);
    //   if (co.exists) {
    //     await conn.drop({ entity: co.name, schema: co.schema }).execute();
    //   }
    // }
    // /**
    //  * Dropping schemas
    //  */
    // for (const schema of _metadata.schemas) {
    //   const cs = await conn.checkSchema({ name: schema.name });
    //   if (cs.exists) {
    //     await conn.drop({ schema: cs.name, check: true }).execute();
    //   }
    // }
  },
);
