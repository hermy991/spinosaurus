import { getTestConnection } from "./tool/tool.ts";
import { Connection } from "spinosaurus/mod.ts";
import { assertEquals } from "deno/testing/asserts.ts";

const con1 = getTestConnection();

Deno.test("delete execute() function", async () => {
  const db: Connection = new Connection(con1);
  const currEntity = `UpdateTable_${window.OBJECT_SEQUENCE++}`;

  const chk = await db.checkObject({ name: currEntity });
  if (chk.exists) {
    await db.drop({ entity: currEntity }).execute();
  }
  await db.create({ entity: currEntity })
    .columns([
      { name: "UserName", spitype: "varchar", length: 100 },
      { name: "FirstName", spitype: "varchar", length: 100 },
    ])
    .execute();
  const data = [{ UserName: "hermy991", FirstName: "Hermy" }, {
    UserName: "yassett77",
    FirstName: "Yassett",
  }];
  await db.insert({ entity: currEntity }).values(data)
    .execute();

  await db.delete({ entity: currEntity }).where([`"UserName" = 'hermy991'`])
    .execute();

  const qs = db.select([`"UserName"`], [`"FirstName"`])
    .from({ entity: currEntity })
    .orderBy([`"UserName"`, "ASC"]);
  const r = await qs.getMany();
  const dataShouldBe = [{ UserName: "yassett77", FirstName: "Yassett" }];

  await db.drop({ entity: currEntity }).execute();

  assertEquals(r, dataShouldBe);
});
