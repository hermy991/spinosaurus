import { getTestConnection } from "./tool/tool.ts"
import { Connection, like, notLike, between } from "spinosaurus/mod.ts";
import { assert, assertEquals } from "deno/testing/asserts.ts";
//import {Connection} from '../spinosaurus/mod.ts'

let con1 = getTestConnection();

const testMessage = "  {}";

Deno.test(testMessage.replace(/\{\}/ig, "select test() function should work"), async () => {
  let db: Connection = new Connection(con1);
  const res = await db.test();
  assert(res);
});
Deno.test(testMessage.replace(/\{\}/ig, "select getRawOne() function should work"), async () => {
  let db: Connection = new Connection(con1);
  let currEntity = `SelectTable_${window.OBJECT_SEQUENCE++}`;
  let chk = await db.checkObject({ name: currEntity });
  if(chk.exists){
    let d1 = await db.drop({entity: currEntity}).execute();
  }
  const data = [{ userName: "hermy991", firstName: "Hermy" }, { userName: "guru", firstName: "Danny" }];
  let cr = await db.create({entity: currEntity})
                   .columns({columnName: "userName", datatype: "varchar", length: 100}, {columnName: "firstName", datatype: "varchar", length: 100})
                   .data(data)
                   .execute();
  let sr = await db.select( [`u."userName"`, `UserName`], [`u."firstName"`, `FirstName`])
                   .from({entity: currEntity, as: "u"})
                   .orderBy([`"userName"`])
                   .getRawOne();
  const dataShouldBe = { UserName: "guru", FirstName: "Danny" };
  await db.drop({entity: currEntity}).execute();
  assertEquals(sr, dataShouldBe);
});
Deno.test(testMessage.replace(/\{\}/ig, "select getRawMany() function should work"), async () => {
  let db: Connection = new Connection(con1);
  let currEntity = `SelectTable_${window.OBJECT_SEQUENCE++}`;
  let chk = await db.checkObject({ name: currEntity });
  if(chk.exists){
    let d1 = await db.drop({entity: currEntity}).execute();
  }
  const data = [{ userName: "hermy991", firstName: "Hermy" }, { userName: "guru", firstName: "Danny" }, { userName: "yasset77", firstName: "Yasset" }];
  let cr = await db.create({entity: currEntity})
                   .columns({columnName: "userName", datatype: "varchar", length: 100}, {columnName: "firstName", datatype: "varchar", length: 100})
                   .data(data)
                   .execute();
  let sr = await db.select()
                   .from({entity: currEntity, as: "u"})
                   .getRawMany();
  await db.drop({entity: currEntity}).execute();
  assertEquals(sr.length, data.length);
});
Deno.test(testMessage.replace(/\{\}/ig, "select getRawMany() function with where should work"), async () => {
  let db: Connection = new Connection(con1);
  let currEntity = `SelectTable_${window.OBJECT_SEQUENCE++}`;
  let chk = await db.checkObject({ name: currEntity });
  if(chk.exists){
    let d1 = await db.drop({entity: currEntity}).execute();
  }
  const data = [{ userName: "hermy991", firstName: "Hermy" }, { userName: "guru", firstName: "Danny" }, { userName: "yasset77", firstName: "Yasset" }];
  let cr = await db.create({entity: currEntity})
                   .columns({columnName: "userName", datatype: "varchar", length: 100}, {columnName: "firstName", datatype: "varchar", length: 100})
                   .data(data)
                   .execute();
  let sr = await db.select()
                   .from({entity: currEntity, as: "u"})
                   .where([`u."userName" = 'hermy991'`])
                   .getRawMany();
  await db.drop({entity: currEntity}).execute();
  assertEquals(sr.length, 1);
});


