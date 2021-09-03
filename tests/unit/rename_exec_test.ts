import { getTestConnection } from "./tool/tool.ts";
import { Connection } from "spinosaurus/mod.ts";
import { assertEquals } from "deno/testing/asserts.ts";
//import {Connection} from '../spinosaurus/mod.ts'

const con1 = getTestConnection();

Deno.test("rename [rename table] execute() function", async () => {
  const db: Connection = new Connection(con1);
  const oldEntity = `RenameTable_${window.OBJECT_SEQUENCE++}`;
  const newEntity = `RenameTable_${window.OBJECT_SEQUENCE++}`;
  const chk1 = await db.checkObject({ name: oldEntity });
  if (chk1.exists) {
    const _d1 = await db.drop({ entity: oldEntity }).execute();
  }
  const chk2 = await db.checkObject({ name: newEntity });
  if (chk2.exists) {
    const _d2 = await db.drop({ entity: newEntity }).execute();
  }

  const _cr = await db.create({ entity: oldEntity })
    .columns([{ name: "column1", spitype: "varchar" }])
    .data({ column1: "que lo que" })
    .execute();

  const _rr = await db.rename({ entity: oldEntity }, { entity: newEntity })
    .execute();

  const sr = await db.select([`"column1"`])
    .from({ entity: newEntity })
    .orderBy([`"column1"`, "ASC"])
    .getMany();

  const resultShouldBe = [{ column1: "que lo que" }];

  const _dr = await db.drop({ entity: newEntity }).execute();

  assertEquals(sr, resultShouldBe);
});

Deno.test("rename [rename table column] execute() function", async () => {
  const db: Connection = new Connection(con1);
  const oldEntity = `RenameTable_${window.OBJECT_SEQUENCE++}`;
  const chk = await db.checkObject({ name: oldEntity });
  if (chk.exists) {
    const _d1 = await db.drop({ entity: oldEntity }).execute();
  }

  const _cr = await db.create({ entity: oldEntity })
    .columns([{ name: "column1", spitype: "varchar" }])
    .data({ column1: "que lo que" })
    .execute();

  const _rr = await db.rename({ entity: oldEntity })
    .columns(["column1", "columnXX"])
    .execute();

  const sr = await db.select([`"columnXX"`])
    .from({ entity: oldEntity })
    .orderBy([`"columnXX"`, "ASC"])
    .getMany();

  const resultShouldBe = [{ columnXX: "que lo que" }];

  const _dr = await db.drop({ entity: oldEntity }).execute();

  assertEquals(sr, resultShouldBe);
});

Deno.test("rename [rename table and column] execute() function", async () => {
  const db: Connection = new Connection(con1);
  const oldEntity = `RenameTable_${window.OBJECT_SEQUENCE++}`;
  const newEntity = `RenameTable_${window.OBJECT_SEQUENCE++}`;
  const chk1 = await db.checkObject({ name: oldEntity });
  if (chk1.exists) {
    const _d1 = await db.drop({ entity: oldEntity }).execute();
  }
  const chk2 = await db.checkObject({ name: newEntity });
  if (chk2.exists) {
    const _d2 = await db.drop({ entity: newEntity }).execute();
  }

  const _cr = await db.create({ entity: oldEntity })
    .columns([{ name: "column1", spitype: "varchar" }])
    .data({ column1: "que lo que" })
    .execute();

  const _rr = await db.rename({ entity: oldEntity }, { entity: newEntity })
    .columns(["column1", "columnXX"])
    .execute();

  const sr = await db.select([`"columnXX"`])
    .from({ entity: newEntity })
    .orderBy([`"columnXX"`, "ASC"])
    .getMany();

  const resultShouldBe = [{ columnXX: "que lo que" }];

  const _dr = await db.drop({ entity: newEntity }).execute();

  assertEquals(sr, resultShouldBe);
});
