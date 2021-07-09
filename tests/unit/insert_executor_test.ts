import { getTestConnection } from "./tool/tool.ts";
import { between, Connection, like, notLike } from "spinosaurus/mod.ts";
import { assert, assertEquals } from "deno/testing/asserts.ts";
//import {Connection} from '../spinosaurus/mod.ts'

let con1 = getTestConnection();

const testMessage = "  {}";

Deno.test(
  testMessage.replace(/\{\}/ig, "insert execute() function should work"),
  async () => {
    let db: Connection = new Connection(con1);
    let currEntity = `InsertTable_${window.OBJECT_SEQUENCE++}`;

    let chk = await db.checkObject({ name: currEntity });
    if (chk.exists) {
      await db.drop({ entity: currEntity }).execute();
    }
    await db.create({ entity: currEntity })
      .columns({ columnName: "UserName", datatype: "varchar", length: 100 }, {
        columnName: "FirstName",
        datatype: "varchar",
        length: 100,
      })
      .execute();

    let data = [{ FirstName: "Hermy", UserName: "hermy991" }, {
      FirstName: "Yassett",
      UserName: "yassett77",
    }];
    let qi = db.insert({ entity: currEntity })
      .values(data);
    await qi.execute();

    let qs = db.select()
      .from({ entity: currEntity });
    const r = await qs.getRawMany();
    const dataShouldBe = data;

    await db.drop({ entity: currEntity }).execute();

    assertEquals(r, dataShouldBe);
  },
);
