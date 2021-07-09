import { getTestConnection } from "./tool/tool.ts";
import { between, Connection, like, notLike } from "spinosaurus/mod.ts";
import { assert, assertEquals } from "deno/testing/asserts.ts";
//import {Connection} from '../spinosaurus/mod.ts'

let con1 = getTestConnection();
const testMessage = "  {}";

Deno.test(
  testMessage.replace(/\{\}/ig, "rename table execute() function should work"),
  async () => {
    let db: Connection = new Connection(con1);
    let oldEntity = `RenameTable_${window.OBJECT_SEQUENCE++}`;
    let newEntity = `RenameTable_${window.OBJECT_SEQUENCE++}`;
    let chk1 = await db.checkObject({ name: oldEntity });
    if (chk1.exists) {
      let d1 = await db.drop({ entity: oldEntity }).execute();
    }
    let chk2 = await db.checkObject({ name: newEntity });
    if (chk2.exists) {
      let d2 = await db.drop({ entity: newEntity }).execute();
    }

    let cr = await db.create({ entity: oldEntity })
      .columns({ columnName: "column1", datatype: "varchar" })
      .data({ column1: "que lo que" })
      .execute();

    let rr = await db.rename({ entity: oldEntity }, { entity: newEntity })
      .execute();

    let sr = await db.select([`"column1"`])
      .from({ entity: newEntity })
      .orderBy([`"column1"`, "ASC"])
      .getRawMany();

    const resultShouldBe: any[] = [{ column1: "que lo que" }];

    let dr = await db.drop({ entity: newEntity }).execute();

    assertEquals(sr, resultShouldBe);
  },
);

Deno.test(
  testMessage.replace(
    /\{\}/ig,
    "rename table column execute() function should work",
  ),
  async () => {
    let db: Connection = new Connection(con1);
    let oldEntity = `RenameTable_${window.OBJECT_SEQUENCE++}`;
    let chk = await db.checkObject({ name: oldEntity });
    if (chk.exists) {
      let d1 = await db.drop({ entity: oldEntity }).execute();
    }

    let cr = await db.create({ entity: oldEntity })
      .columns({ columnName: "column1", datatype: "varchar" })
      .data({ column1: "que lo que" })
      .execute();

    let rr = await db.rename({ entity: oldEntity })
      .columns(["column1", "columnXX"])
      .execute();

    let sr = await db.select([`"columnXX"`])
      .from({ entity: oldEntity })
      .orderBy([`"columnXX"`, "ASC"])
      .getRawMany();

    const resultShouldBe: any[] = [{ columnXX: "que lo que" }];

    let dr = await db.drop({ entity: oldEntity }).execute();

    assertEquals(sr, resultShouldBe);
  },
);

Deno.test(
  testMessage.replace(
    /\{\}/ig,
    "rename table and column execute() function should work",
  ),
  async () => {
    let db: Connection = new Connection(con1);
    let oldEntity = `RenameTable_${window.OBJECT_SEQUENCE++}`;
    let newEntity = `RenameTable_${window.OBJECT_SEQUENCE++}`;
    let chk1 = await db.checkObject({ name: oldEntity });
    if (chk1.exists) {
      let d1 = await db.drop({ entity: oldEntity }).execute();
    }
    let chk2 = await db.checkObject({ name: newEntity });
    if (chk2.exists) {
      let d2 = await db.drop({ entity: newEntity }).execute();
    }

    let cr = await db.create({ entity: oldEntity })
      .columns({ columnName: "column1", datatype: "varchar" })
      .data({ column1: "que lo que" })
      .execute();

    let rr = await db.rename({ entity: oldEntity }, { entity: newEntity })
      .columns(["column1", "columnXX"])
      .execute();

    let sr = await db.select([`"columnXX"`])
      .from({ entity: newEntity })
      .orderBy([`"columnXX"`, "ASC"])
      .getRawMany();

    const resultShouldBe: any[] = [{ columnXX: "que lo que" }];

    let dr = await db.drop({ entity: newEntity }).execute();

    assertEquals(sr, resultShouldBe);
  },
);
