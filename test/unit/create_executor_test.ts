import { getTestConnection } from "./tool/tool.ts"
import { Connection, like, notLike, between } from "spinosaurus/mod.ts";
import { assert, assertEquals } from "deno/testing/asserts.ts";

let con1 = getTestConnection();
const testMessage = "  {}";

Deno.test(testMessage.replace(/\{\}/ig, "create execute() function should work"), async () => {
  let db: Connection = new Connection(con1);
  let currEntity = `CreateTable_${window.OBJECT_SEQUENCE++}`;
  let chk = await db.checkObject({ name: currEntity });
  if(chk.exists){
    let d1 = await db.drop({entity: currEntity}).execute();
  }

  let qs = await db.create({entity: currEntity})
                   .columns({columnName: "column1", datatype: "varchar"})
                   .execute();

  let sr = await db.select([`"column1"`])
                   .from({entity: currEntity})
                   .orderBy([`"column1"`, "ASC"])
                   .getRawMany();
  
  const resultShouldBe: any[] = []
  
  let dr = await db.drop({entity: currEntity}).execute();

  assertEquals(sr, resultShouldBe);
});

Deno.test(testMessage.replace(/\{\}/ig, "create execute() with data function should work"), async () => {
  let db: Connection = new Connection(con1);
  let currEntity = `CreateTable_${window.OBJECT_SEQUENCE++}`;
  let chk = await db.checkObject({ name: currEntity });
  if(chk.exists){
    let d1 = await db.drop({entity: currEntity}).execute();
  }

  const resultShouldBe = [{ column1: "x1", column2: "x2" }, { column1: "y1", column2: "y2" }];

  let r = await db.create({entity: currEntity})
                  .columns({columnName: "column1", datatype: "varchar", length: 100}, {columnName: "column2", datatype: "varchar", length: 100})
                  .data(resultShouldBe)
                  .execute();

  let sr = await db.select([`"column1"`], [`"column2"`])
                   .from({entity: currEntity})
                   .orderBy([`"column1"`, "ASC"])
                   .getRawMany();

  let dr = await db.drop({entity: currEntity}).execute();

  assertEquals(sr, resultShouldBe);
});