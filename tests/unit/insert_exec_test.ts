import { getTestConnection } from "./tool/tool.ts";
import { Connection } from "spinosaurus/mod.ts";
import { assertEquals } from "deno/testing/asserts.ts";

const con1 = getTestConnection();

Deno.test("insert execute() function", async () => {
  const db: Connection = new Connection(con1);
  const currEntity = `InsertTable_${window.OBJECT_SEQUENCE++}`;

  const chk = await db.checkObject({ name: currEntity });
  if (chk.exists) {
    await db.drop({ entity: currEntity }).execute();
  }
  await db.create({ entity: currEntity })
    .columns({ columnName: "UserName", spitype: "varchar", length: 100 }, {
      columnName: "FirstName",
      spitype: "varchar",
      length: 100,
    })
    .execute();

  const data = [{ FirstName: "Hermy", UserName: "hermy991" }, {
    FirstName: "Yassett",
    UserName: "yassett77",
  }];
  const qi = db.insert({ entity: currEntity })
    .values(data);
  await qi.execute();

  const qs = db.select()
    .from({ entity: currEntity });
  const r = await qs.getMany();
  const dataShouldBe = data;

  await db.drop({ entity: currEntity }).execute();

  assertEquals(r, dataShouldBe);
});
