import { getTestConnection } from "./tool/tool.ts";
import { between, Connection, like, notLike } from "spinosaurus/mod.ts";
import { assert, assertEquals } from "deno/testing/asserts.ts";
//import {Connection} from '../spinosaurus/mod.ts'

let con1 = getTestConnection();
const testMessage = "  {}";
Deno.test(
  testMessage.replace(
    /\{\}/ig,
    "drop [drop table] execute() function should work",
  ),
  async () => {
    let db: Connection = new Connection(con1);
    let currEntity = `DropTable_${window.OBJECT_SEQUENCE++}`;
    let chk = await db.checkObject({ name: currEntity });
    if (chk.exists) {
      let drop1 = db.drop({ entity: currEntity });
      let drop1r = await drop1.execute();
    }

    let qs = db.create({ entity: currEntity })
      .columns({ columnName: "column1", datatype: "varchar" });
    const creater = await qs.execute();

    let drop2 = db.drop({ entity: currEntity });
    let drop2r = await drop2.execute();

    const resultShouldBe = {
      query: {
        args: [],
        fields: undefined,
        result_type: 0,
        text: 'DROP TABLE "' + currEntity + '"',
      },
      _done: true,
      command: "DROP",
      rowCount: NaN,
      rowDescription: undefined,
      warnings: [],
      rows: [],
    };
    assertEquals(drop2r, resultShouldBe);
  },
);
/*************************************
 * TODO drop columns execute() test
 * Insert is necesary
 *************************************/
// Deno.test(testMessage.replace(/\{\}/ig, "[drop columns] execute() function should work"), async () => {
//   let db: Connection = new Connection(con1);
//   let currEntity = `DropTableColumn_${objectSequence++}`;
//   let chk = await db.checkObject({ name: currEntity });
//   if(chk.exists){
//     let drop1 = db.drop({entity: currEntity});
//     let drop1r = await drop1.execute();
//   }

//   let qs = db.create({entity: currEntity})
//              .columns({columnName: "column1", datatype: "varchar" });
//   const creater = await qs.execute();

//   let drop2 = db.drop({entity: currEntity});
//   await drop2.execute();
//   let data =

//   assertEquals(drop2r, resultShouldBe);
// });
/*************************************
 * TODO rename tests
 * Insert is necesary
 *************************************/
