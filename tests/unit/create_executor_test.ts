import { getTestConnection } from "./tool/tool.ts";
import { Connection } from "spinosaurus/mod.ts";
import { assert, assertEquals } from "deno/testing/asserts.ts";

const con1 = getTestConnection();
const testMessage = "  {}";

Deno.test(
  testMessage.replace(
    /\{\}/ig,
    "create [create table] execute() function should work",
  ),
  async () => {
    const db: Connection = new Connection(con1);
    const currEntity = `CreateTable_${window.OBJECT_SEQUENCE++}`;
    const chk = await db.checkObject({ name: currEntity });
    if (chk.exists) {
      const _d1 = await db.drop({ entity: currEntity }).execute();
    }

    const _qs = await db.create({ entity: currEntity })
      .columns({ columnName: "column1", spitype: "varchar" })
      .execute();

    const sr = await db.select([`"column1"`])
      .from({ entity: currEntity })
      .orderBy([`"column1"`, "ASC"])
      .getRawMany();

    const resultShouldBe: any[] = [];

    const _dr = await db.drop({ entity: currEntity }).execute();

    assertEquals(sr, resultShouldBe);
  },
);

Deno.test(
  testMessage.replace(
    /\{\}/ig,
    "create [create table with data] execute() function should work",
  ),
  async () => {
    const db: Connection = new Connection(con1);
    const currEntity = `CreateTable_${window.OBJECT_SEQUENCE++}`;
    const chk = await db.checkObject({ name: currEntity });
    if (chk.exists) {
      const _d1 = await db.drop({ entity: currEntity }).execute();
    }

    const resultShouldBe = [{ column1: "x1", column2: "x2" }, {
      column1: "y1",
      column2: "y2",
    }];

    const _r = await db.create({ entity: currEntity })
      .columns({ columnName: "column1", spitype: "varchar", length: 100 }, {
        columnName: "column2",
        spitype: "varchar",
        length: 100,
      })
      .data(resultShouldBe)
      .execute();

    const sr = await db.select([`"column1"`], [`"column2"`])
      .from({ entity: currEntity })
      .orderBy([`"column1"`, "ASC"])
      .getRawMany();

    const _dr = await db.drop({ entity: currEntity }).execute();

    assertEquals(sr, resultShouldBe);
  },
);

Deno.test(
  testMessage.replace(
    /\{\}/ig,
    "create [create schema] execute() function should work",
  ),
  async () => {
    const db: Connection = new Connection(con1);
    const currSchema = `CreateSchema_${window.OBJECT_SEQUENCE++}`;
    const chk1 = await db.checkSchema({ name: currSchema });
    if (chk1.exists) {
      const _d1 = await db.drop({ schema: currSchema, check: true }).execute();
    }
    const _c1 = await db.create({ schema: currSchema, check: true }).execute();
    const chk2 = await db.checkSchema({ name: currSchema });
    const _d2 = await db.drop({ schema: currSchema, check: true }).execute();

    assert(chk2.exists === true, `schema '${currSchema}' should be created`);
  },
);
