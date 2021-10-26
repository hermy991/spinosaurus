import { getTestConnection } from "./tool/tool.ts";
import { assertEquals } from "deno/testing/asserts.ts";
import { Connection } from "spinosaurus/mod.ts";

async function clearPlayground(db: Connection, schema: string, tables: Array<string>) {
  /**
   * Dropping tables
   */
  for (const table of tables) {
    const co = await db.checkObject({ name: table, schema });
    if (co.exists) {
      const t = { entity: co.name, schema: co.schema };
      console.log("co.schema", co.schema, "table", co.name);
      await db.drop(t).execute();
    }
  }
  /**
   * Dropping schemas
   */
  const cs = await db.checkSchema({ name: schema });
  if (cs.exists) {
    const t = { schema: cs.name, check: true };
    console.log("cs.schema", cs.name);
    await db.drop(t).execute();
  }
}

const conOpts = getTestConnection();

Deno.test("transaction [rollback] sql", async () => {
  const conOptsX = self.structuredClone(conOpts);
  const schema = "transaction";
  const user1 = "User1";
  const db: Connection = new Connection(conOptsX);
  const ch = await db.checkSchema({ name: schema });
  if (ch.exists) {
    await db.drop({ schema, check: true }).execute();
  }
  const xxq = db.create({ schema, check: true });
  await xxq.execute();
  await db.create({ entity: user1, schema })
    .columns([{ name: "column1", spitype: "varchar", length: 100, primary: true }]).execute();
  // // Batch Transaction
  // db.transaction();
  // const i1 = db.insert([user1, schema]).values({ column1: "xx" });
  // await i1.execute();
  // const data1 = await db.select().from({ entity: user1, schema }).getMany();
  // assertEquals(data1.length, 1);
  // db.rollback();
  // const data2 = await db.select().from({ entity: user1, schema }).getMany();
  // assertEquals(data2.length, 0);

  // Function Transaction
  const te = await db.transaction(async () => {
    await db.insert([user1, schema]).values([{ column1: "xx" }]).execute();
    const data3 = await db.select().from({ entity: user1, schema }).getMany();
    assertEquals(data3.length, 1);
    await db.insert([user1, schema]).values([{ column1: "xx" }]).execute();
  });
  const data4 = await db.select().from({ entity: user1, schema }).getMany();
  await clearPlayground(db, schema, [user1]);
  assertEquals(data4.length, 0);
});
