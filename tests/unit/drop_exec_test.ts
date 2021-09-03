import { getTestConnection } from "./tool/tool.ts";
import { Connection } from "spinosaurus/mod.ts";
import { assert } from "deno/testing/asserts.ts";

const con1 = getTestConnection();
Deno.test("drop [drop table] execute() function", async () => {
  const db: Connection = new Connection(con1);
  /**
     * DROPING TABLE
     */
  const currEntity = `DropTable_${window.OBJECT_SEQUENCE++}`;
  const chk1 = await db.checkObject({ name: currEntity });
  if (chk1.exists) {
    const drop1 = db.drop({ entity: currEntity });
    const _drop1r = await drop1.execute();
  }
  const qs1 = db.create({ entity: currEntity })
    .columns([{ name: "column1", spitype: "varchar" }]);
  const _creater1 = await qs1.execute();
  const _drop2 = await db.drop({ entity: currEntity }).execute();
  const chk2 = await db.checkObject({ name: currEntity });
  assert(chk2.exists === false, `entity '${currEntity}' should be droped`);
});
Deno.test("drop [drop schema] execute() function", async () => {
  const db: Connection = new Connection(con1);
  /**
     * DROPING SCHEMA
     */
  const currSchema = `DropSchema_${window.OBJECT_SEQUENCE++}`;
  const chk1 = await db.checkSchema({ name: currSchema });
  if (chk1.exists) {
    const _d1 = await db.drop({ schema: currSchema, check: true }).execute();
  }
  const _c2 = await db.create({ schema: currSchema, check: true }).execute();
  const _d2 = await db.drop({ schema: currSchema, check: true }).execute();
  const chk3 = await db.checkSchema({ name: currSchema });
  assert(chk3.exists === false, `schema '${currSchema}' should be droped`);
});
