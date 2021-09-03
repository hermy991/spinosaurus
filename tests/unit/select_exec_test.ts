import { getTestConnection } from "./tool/tool.ts";
import { Connection } from "spinosaurus/mod.ts";
import { assert, assertEquals } from "deno/testing/asserts.ts";

const con1 = getTestConnection();

Deno.test("select test() function", async () => {
  const db: Connection = new Connection(con1);
  const res = await db.test();
  assert(res);
});
Deno.test("select getOne() function", async () => {
  const db: Connection = new Connection(con1);
  const currEntity = `SelectTable_${window.OBJECT_SEQUENCE++}`;
  const chk = await db.checkObject({ name: currEntity });
  if (chk.exists) {
    const _d1 = await db.drop({ entity: currEntity }).execute();
  }
  const data = [{ userName: "hermy991", firstName: "Hermy" }, {
    userName: "guru",
    firstName: "Danny",
  }];
  const _cr = await db.create({ entity: currEntity })
    .columns([
      { name: "userName", spitype: "varchar", length: 100 },
      { name: "firstName", spitype: "varchar", length: 100 },
    ])
    .data(data)
    .execute();
  const sr = await db.select([`u."userName"`, `UserName`], [
    `u."firstName"`,
    `FirstName`,
  ])
    .from({ entity: currEntity, as: "u" })
    .orderBy([`"userName"`])
    .getOne();
  const dataShouldBe = { UserName: "guru", FirstName: "Danny" };
  await db.drop({ entity: currEntity }).execute();
  assertEquals(sr, dataShouldBe);
});
Deno.test("select getMany() function", async () => {
  const db: Connection = new Connection(con1);
  const currEntity = `SelectTable_${window.OBJECT_SEQUENCE++}`;
  const chk = await db.checkObject({ name: currEntity });
  if (chk.exists) {
    const _d1 = await db.drop({ entity: currEntity }).execute();
  }
  const data = [{ userName: "hermy991", firstName: "Hermy" }, {
    userName: "guru",
    firstName: "Danny",
  }, { userName: "yasset77", firstName: "Yasset" }];
  const _cr = await db.create({ entity: currEntity })
    .columns([
      { name: "userName", spitype: "varchar", length: 100 },
      { name: "firstName", spitype: "varchar", length: 100 },
    ])
    .data(data)
    .execute();
  const sr = await db.select()
    .from({ entity: currEntity, as: "u" })
    .getMany();
  await db.drop({ entity: currEntity }).execute();
  assertEquals(sr.length, data.length);
});
Deno.test("select getMany() function with where", async () => {
  const db: Connection = new Connection(con1);
  const currEntity = `SelectTable_${window.OBJECT_SEQUENCE++}`;
  const chk = await db.checkObject({ name: currEntity });
  if (chk.exists) {
    const _d1 = await db.drop({ entity: currEntity }).execute();
  }
  const data = [{ userName: "hermy991", firstName: "Hermy" }, {
    userName: "guru",
    firstName: "Danny",
  }, { userName: "yasset77", firstName: "Yasset" }];
  const _cr = await db.create({ entity: currEntity })
    .columns([
      { name: "userName", spitype: "varchar", length: 100 },
      { name: "firstName", spitype: "varchar", length: 100 },
    ])
    .data(data)
    .execute();
  const sr = await db.select()
    .from({ entity: currEntity, as: "u" })
    .where([`u."userName" = 'hermy991'`])
    .getMany();
  await db.drop({ entity: currEntity }).execute();
  assertEquals(sr.length, 1);
});
