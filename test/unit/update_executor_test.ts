
import { getTestConnection } from "./tool/tool.ts"
import { Connection, like, notLike, between } from "spinosaurus/mod.ts";
import { assert, assertEquals } from "deno/testing/asserts.ts";
//import {Connection} from '../spinosaurus/mod.ts'

let con1 = getTestConnection()

const testMessage = "  {}";

Deno.test(testMessage.replace(/\{\}/ig, "update execute() function should work"), async () => {
  let db: Connection = new Connection(con1);
  let currEntity = `UpdateTable_${window.OBJECT_SEQUENCE++}`;

  let chk = await db.checkObject({ name: currEntity });
  if(chk.exists){
    await db.drop({entity: currEntity}).execute();
  }
  await db.create({entity: currEntity})
          .columns({ columnName: "UserName", datatype: "varchar", length: 100 }, 
                   { columnName: "FirstName", datatype: "varchar", length: 100 })
          .execute();
  let data = [{UserName: "hermy991", FirstName: "Hermy"}, {UserName: "yassett77", FirstName: "Yassett"}];
  await db.insert({entity: currEntity})
          .values(data)
          .execute();

  await db.update({entity: currEntity})
          .set({FirstName: "Danny", UserName: "guru"})
          .where([`"UserName" = 'hermy991'`])
          .execute();

  let qs = db.select([`"UserName"`], [`"FirstName"`])
             .from({entity: currEntity})
             .orderBy([`"UserName"`, "ASC"]);
  const r = await qs.getRawMany();
  const dataShouldBe = [{ UserName: "guru", FirstName: "Danny"}, {UserName: "yassett77", FirstName: "Yassett"}];;
  
  await db.drop({entity: currEntity}).execute();

  // console.log({r, dataShouldBe})
  assertEquals(r, dataShouldBe);
});


