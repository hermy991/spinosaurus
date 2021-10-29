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
      await db.drop(t).execute();
    }
  }
  /**
   * Dropping schemas
   */
  const cs = await db.checkSchema({ name: schema });
  if (cs.exists) {
    const t = { schema: cs.name, check: true };
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
  // Batch Transaction
  await db.startTransaction();
  await db.insert([user1, schema]).values({ column1: "xx" }).execute();
  const data1 = await db.select().from({ entity: user1, schema }).getMany();
  assertEquals(data1.length, 1);
  await db.rollback();
  const data2 = await db.select().from({ entity: user1, schema }).getMany();
  assertEquals(data2.length, 0);

  // Batch Transaction With Transaction Name
  await db.startTransaction("test_transaction_batch");
  await db.insert([user1, schema]).values({ column1: "xx" }).execute();
  const data3 = await db.select().from({ entity: user1, schema }).getMany();
  assertEquals(data3.length, 1);
  await db.rollback("test_transaction_batch");
  const data4 = await db.select().from({ entity: user1, schema }).getMany();
  assertEquals(data4.length, 0);

  // Function Transaction
  let ck1 = "transaction execute not ok";
  const f1 = async () => {
    await db.insert([user1, schema]).values([{ column1: "xx" }]).execute();
    const data = await db.select().from({ entity: user1, schema }).getMany();
    assertEquals(data.length, 1);
    ck1 = "transaction execute ok";
    await db.insert([user1, schema]).values([{ column1: "xx" }]).execute();
  };
  const r1 = await db.startTransaction(f1);
  assertEquals(ck1, "transaction execute ok");
  const data5 = await db.select().from({ entity: user1, schema }).getMany();
  assertEquals(data5.length, 0);

  // Function Transaction With Transaction Name
  ck1 = "transaction execute not ok";
  const _r2 = await db.startTransaction("test_transaction_fun", f1);
  assertEquals(ck1, "transaction execute ok");
  const data6 = await db.select().from({ entity: user1, schema }).getMany();
  assertEquals(data6.length, 0);

  await clearPlayground(db, schema, [user1]);
});

Deno.test("transaction [commit] sql", async () => {
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
  // Batch Transaction
  await db.startTransaction();
  await db.insert([user1, schema]).values({ column1: "x" }).execute();
  const data1 = await db.select().from({ entity: user1, schema }).getMany();
  assertEquals(data1.length, 1);
  await db.commit();
  const data2 = await db.select().from({ entity: user1, schema }).getMany();
  assertEquals(data2.length, 1);

  // Batch Transaction With Transaction Name
  await db.startTransaction("test_transaction_batch");
  await db.insert([user1, schema]).values({ column1: "xx" }).execute();
  const data3 = await db.select().from({ entity: user1, schema }).getMany();
  assertEquals(data3.length, 2);
  await db.commit("test_transaction_batch");
  const data4 = await db.select().from({ entity: user1, schema }).getMany();
  assertEquals(data4.length, 2);

  // Function Transaction
  let ck1 = "transaction execute not ok";
  const r1 = await db.startTransaction(async () => {
    await db.insert([user1, schema]).values([{ column1: "xxx" }]).execute();
    const data = await db.select().from({ entity: user1, schema }).getMany();
    assertEquals(data.length, 3);
    ck1 = "transaction execute ok";
  });
  assertEquals(ck1, "transaction execute ok");
  const data5 = await db.select().from({ entity: user1, schema }).getMany();
  assertEquals(data5.length, 3);

  // Function Transaction With Transaction Name
  ck1 = "transaction execute not ok";
  const _r2 = await db.startTransaction("test_transaction_fun", async () => {
    await db.insert([user1, schema]).values([{ column1: "xxxx" }]).execute();
    const data = await db.select().from({ entity: user1, schema }).getMany();
    assertEquals(data.length, 4);
    ck1 = "transaction execute ok";
  });
  assertEquals(ck1, "transaction execute ok");
  const data6 = await db.select().from({ entity: user1, schema }).getMany();
  assertEquals(data6.length, 4);

  await clearPlayground(db, schema, [user1]);
});
