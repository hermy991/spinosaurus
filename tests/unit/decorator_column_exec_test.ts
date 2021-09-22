import { fs } from "../../deps.ts";
import { getTestConnection } from "./tool/tool.ts";
import { assert, assertEquals } from "deno/testing/asserts.ts";
import { Connection, createConnection, getMetadata } from "spinosaurus/mod.ts";
import * as path from "deno/path/mod.ts";

const conOpts = getTestConnection();

Deno.test("decorator column should work", async () => {
  const conOptsX = self.structuredClone(conOpts);
  const dirname = path.dirname(path.fromFileUrl(import.meta.url));
  conOptsX.entities = [`${dirname}/playground/decorators/**/Column*.ts`];
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
        name,
        spitype,
        length,
        nullable,
        precision,
        scale,
      } = column.mixeds;
      assert(
        (cds.rows || []).some((x) => x.column_name === name),
        `column '${name}' must to be created`,
      );
      if (nullable === true) {
        assert(
          (cds.rows || []).some((x) => x.column_name === name && x.is_nullable === "YES"),
          `column '${name}' must to be null`,
        );
      }
      if (nullable === false) {
        assert(
          (cds.rows || []).some((x) => x.column_name === name && x.is_nullable === "NO"),
          `column '${name}' must be not null`,
        );
      }
      if (precision) {
        assert(
          (cds.rows || []).some((x) => x.column_name === name && x.numeric_precision === precision),
          `column '${name}' must has precision of '${precision}'`,
        );
      }
      if (scale) {
        assert(
          (cds.rows || []).some((x) => x.column_name === name && x.numeric_scale === scale),
          `column '${name}' must has scale of '${scale}'`,
        );
      }
      if (spitype == "varchar" && length) {
        assert(
          (cds.rows || []).some((x) =>
            x.column_name === name &&
            x.character_maximum_length === length
          ),
          `column '${name}' must has length of '${length}'`,
        );
      }
    }

    const {
      target, /*Class*/
      options, /*Decorator Options*/
      mixeds, /*Class And Decorator Union*/
    } = table;
    const co = await conn.checkObject(<any> mixeds);
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
        (<any> target).name,
        co.name,
        `Table name '${co.name}' should be created with class name '${(<any> target).name}', target.name to table name`,
      );
    }
  }
  /**
   * Dropping tables
   */
  for (const table of _metadata.tables) {
    const co = await conn.checkObject((<any> table).mixeds);
    if (co.exists) {
      await conn.drop({ entity: co.name, schema: co.schema }).execute();
    }
  }
  /**
   * Dropping schemas
   */
  for (const schema of _metadata.schemas) {
    const cs = await conn.checkSchema({ name: schema.name });
    if (cs.exists) {
      await conn.drop({ schema: cs.name, check: true }).execute();
    }
  }
});

Deno.test("decorator column adding columns should work", async () => {
  const conOptsX = self.structuredClone(conOpts);
  const entity = "AddColumnTypes1";
  const schema = "decorator";
  const db = new Connection(conOptsX);
  const chk1 = await db.checkObject({ name: entity, schema });
  if (chk1.exists) {
    await db.drop({ entity }).execute();
  }
  await db.create({ schema, check: true })
    .execute();
  await db.create({ entity, schema })
    .columns([{ name: "string1", spitype: "bigint" }])
    .execute();

  const dirname = path.dirname(path.fromFileUrl(import.meta.url));
  conOptsX.entities = [`${dirname}/playground/decorators/**/AddColumn*.ts`];
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
    for (const entity of conOptsX.entities) {
      for await (const file of fs.expandGlob(entity)) {
        const path = file.path.replaceAll(`\\`, `/`).replaceAll(`C:/`, `/`);
        const { AddColumnTypes1 } = await import(path);
        const finstance = new AddColumnTypes1();
        for (const propertyKey in finstance) {
          assert(
            (cds.rows || []).some((x) =>
              x.table_name === AddColumnTypes1.name &&
              x.column_name === propertyKey
            ),
            `path '${path}', property key '${propertyKey}' does not have a column database related`,
          );
        }
      }
    }
    for (const column of table.columns) {
      const {
        name,
        spitype,
        // length,
        // nullable,
        // precision,
        // scale,
      } = column.mixeds;
      if (["string2", "string3", "string4"].includes(name + "")) {
        assert(
          (cds.rows || []).some((x) =>
            x.column_name === name && x.data_type === "text" &&
            spitype === "text"
          ),
          `column '${name}' must be 'text' type and spitype(${spitype}) must by 'text'`,
        );
      }
      if (["number1", "number2", "number3"].includes(name + "")) {
        assert(
          (cds.rows || []).some((x) =>
            x.column_name === name && x.data_type === "numeric" &&
            spitype === "numeric"
          ),
          `column '${name}' must be 'numeric' type and spitype(${spitype}) must by 'numeric'`,
        );
      }
      if (["bigint1", "bigint2", "bigint3"].includes(name + "")) {
        assert(
          (cds.rows || []).some((x) =>
            x.column_name === name && x.data_type === "bigint" &&
            spitype === "bigint"
          ),
          `column '${name}' must be 'bigint' type and spitype(${spitype}) must by 'bigint'`,
        );
      }
      if (["boolean1", "boolean2", "boolean3"].includes(name + "")) {
        assert(
          (cds.rows || []).some((x) =>
            x.column_name === name && x.data_type === "boolean" &&
            spitype === "boolean"
          ),
          `column '${name}' must be 'boolean' type and spitype(${spitype}) must by 'boolean'`,
        );
      }
      if (["timestamp1", "timestamp2", "timestamp3"].includes(name + "")) {
        assert(
          (cds.rows || []).some((x) =>
            x.column_name === name &&
            x.data_type === "timestamp without time zone" &&
            spitype === "timestamp"
          ),
          `column '${name}' must be 'timestamp without time zone' type and spitype(${spitype}) must by 'timestamp'`,
        );
      }
      if (
        ["arraybuffer1", "arraybuffer3", "arraybuffer3"].includes(name + "")
      ) {
        assert(
          (cds.rows || []).some((x) =>
            x.column_name === name && x.data_type === "bytea" &&
            spitype === "bytearray"
          ),
          `column '${name}' must be 'bytea' type and spitype(${spitype}) must by 'bytearray'`,
        );
      }
      if (["blob1", "blob2", "blob3"].includes(name + "")) {
        assert(
          (cds.rows || []).some((x) =>
            x.column_name === name && x.data_type === "bytea" &&
            spitype === "bytearray"
          ),
          `column '${name}' must be 'bytea' type and spitype(${spitype}) must by 'bytearray'`,
        );
      }
    }
  }
  /**
   * Dropping tables
   */
  for (const table of _metadata.tables) {
    const co = await conn.checkObject((<any> table).mixeds);
    if (co.exists) {
      await conn.drop({ entity: co.name, schema: co.schema }).execute();
    }
  }
  /**
   * Dropping schemas
   */
  for (const schema of _metadata.schemas) {
    const cs = await conn.checkSchema({ name: schema.name });
    if (cs.exists) {
      await conn.drop({ schema: cs.name, check: true }).execute();
    }
  }
});

Deno.test("decorator column modify columns should work", async () => {
  const conOptsX = self.structuredClone(conOpts);
  const entity = "ModColumnTypes1";
  const schema = "decorator";
  const db = new Connection(conOptsX);
  const chk1 = await db.checkObject({ name: entity, schema });
  if (chk1.exists) {
    await db.drop({ entity }).execute();
  }
  await db.create({ schema, check: true })
    .execute();
  await db.create({ entity, schema })
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
    ])
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
    for (const entity of conOptsX.entities) {
      for await (const file of fs.expandGlob(entity)) {
        const path = file.path.replaceAll(`\\`, `/`).replaceAll(`C:/`, `/`);
        const { ModColumnTypes1 } = await import(path);
        const finstance = new ModColumnTypes1();
        for (const propertyKey in finstance) {
          assert(
            (cds.rows || []).some((x) =>
              x.table_name === ModColumnTypes1.name &&
              x.column_name === propertyKey
            ),
            `path '${path}', property key '${propertyKey}' does not have a column database related`,
          );
        }
      }
    }
    for (const column of table.columns) {
      const {
        name,
        spitype,
        // length,
        // nullable,
        // precision,
        // scale,
        // default
      } = column.mixeds;
      if (["string1", "string2", "string3"].includes(name + "")) {
        assert(
          (cds.rows || []).some((x) =>
            x.column_name === name && x.data_type === "text" &&
            spitype === "text"
          ),
          `column '${name}' must be 'text' type and spitype(${spitype}) must by 'text'`,
        );
      }
      if (["number1", "number2", "number3"].includes(name + "")) {
        assert(
          (cds.rows || []).some((x) =>
            x.column_name === name && x.data_type === "numeric" &&
            spitype === "numeric"
          ),
          `column '${name}' must be 'numeric' type and spitype(${spitype}) must by 'numeric'`,
        );
      }
      if (["bigint1", "bigint2", "bigint3"].includes(name + "")) {
        assert(
          (cds.rows || []).some((x) =>
            x.column_name === name && x.data_type === "bigint" &&
            spitype === "bigint"
          ),
          `column '${name}' must be 'bigint' type and spitype(${spitype}) must by 'bigint'`,
        );
      }
      if (["boolean1", "boolean2", "boolean3"].includes(name + "")) {
        assert(
          (cds.rows || []).some((x) =>
            x.column_name === name && x.data_type === "boolean" &&
            spitype === "boolean"
          ),
          `column '${name}' must be 'boolean' type and spitype(${spitype}) must by 'boolean'`,
        );
      }
      if (["timestamp1", "timestamp2", "timestamp3"].includes(name + "")) {
        assert(
          (cds.rows || []).some((x) =>
            x.column_name === name &&
            x.data_type === "timestamp without time zone" &&
            spitype === "timestamp"
          ),
          `column '${name}' must be 'timestamp without time zone' type and spitype(${spitype}) must by 'timestamp'`,
        );
      }
      if (
        ["arraybuffer1", "arraybuffer3", "arraybuffer3"].includes(name + "")
      ) {
        assert(
          (cds.rows || []).some((x) =>
            x.column_name === name && x.data_type === "bytea" &&
            spitype === "bytearray"
          ),
          `column '${name}' must be 'bytea' type and spitype(${spitype}) must by 'bytearray'`,
        );
      }
      if (["blob1", "blob2", "blob3"].includes(name + "")) {
        assert(
          (cds.rows || []).some((x) =>
            x.column_name === name && x.data_type === "bytea" &&
            spitype === "bytearray"
          ),
          `column '${name}' must be 'bytea' type and spitype(${spitype}) must by 'bytearray'`,
        );
      }
    }
  }
  /**
   * Dropping tables
   */
  for (const table of _metadata.tables) {
    const co = await conn.checkObject((<any> table).mixeds);
    if (co.exists) {
      await conn.drop({ entity: co.name, schema: co.schema }).execute();
    }
  }
  /**
   * Dropping schemas
   */
  for (const schema of _metadata.schemas) {
    const cs = await conn.checkSchema({ name: schema.name });
    if (cs.exists) {
      await conn.drop({ schema: cs.name, check: true }).execute();
    }
  }
});

Deno.test("decorator column dropping columns should work", async () => {
  const conOptsX = self.structuredClone(conOpts);
  const entity = "DroColumnTypes1";
  const schema = "decorator";
  const db = new Connection(conOptsX);
  const chk1 = await db.checkObject({ name: entity, schema });
  if (chk1.exists) {
    await db.drop({ entity }).execute();
  }
  await db.create({ schema, check: true })
    .execute();
  await db.create({ entity, schema })
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
    ])
    .execute();

  const dirname = path.dirname(path.fromFileUrl(import.meta.url));
  conOptsX.entities = [`${dirname}/playground/decorators/**/DroColumn*.ts`];
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
    assert(
      (cds.rows || []).length === 1,
      `tabla "${schema}"."${entity}"' posee más de una columna`,
    );
    assert(
      (cds.rows || []).some((x) => x.column_name === "string1"),
      `columna "${schema}"."${entity}"."string1" no existe en la tabla "${schema}"."${entity}"`,
    );
  }
  /**
   * Dropping tables
   */
  for (const table of _metadata.tables) {
    const co = await conn.checkObject((<any> table).mixeds);
    if (co.exists) {
      await conn.drop({ entity: co.name, schema: co.schema }).execute();
    }
  }
  /**
   * Dropping schemas
   */
  for (const schema of _metadata.schemas) {
    const cs = await conn.checkSchema({ name: schema.name });
    if (cs.exists) {
      await conn.drop({ schema: cs.name, check: true }).execute();
    }
  }
});
