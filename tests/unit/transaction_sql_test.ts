import { clearPlayground, getTestConnection } from "./tool/tool.ts";
import { assertEquals } from "deno/testing/asserts.ts";
import { Connection } from "spinosaurus/mod.ts";

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
  await db.rollbackTransaction();
  const data2 = await db.select().from({ entity: user1, schema }).getMany();
  assertEquals(data2.length, 0);

  // Batch Transaction With Transaction Name
  await db.startTransaction("test_transaction_batch");
  await db.insert([user1, schema]).values({ column1: "xx" }).execute();
  const data3 = await db.select().from({ entity: user1, schema }).getMany();
  assertEquals(data3.length, 1);
  await db.rollbackTransaction("test_transaction_batch");
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
  const data6 = await db.select().from({ entity: user1, schema }).getMany();
  await clearPlayground(db, [user1], [schema]);
  assertEquals(ck1, "transaction execute ok");
  assertEquals(data6.length, 0);
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
  await db.commitTransaction();
  const data2 = await db.select().from({ entity: user1, schema }).getMany();
  assertEquals(data2.length, 1);

  // Batch Transaction With Transaction Name
  await db.startTransaction("test_transaction_batch");
  await db.insert([user1, schema]).values({ column1: "xx" }).execute();
  const data3 = await db.select().from({ entity: user1, schema }).getMany();
  assertEquals(data3.length, 2);
  await db.commitTransaction("test_transaction_batch");
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

  await clearPlayground(db, [user1], [schema]);
});
