import { getTestConnection } from "./tool/tool.ts";
import { Connection } from "spinosaurus/mod.ts";
import { assert } from "deno/testing/asserts.ts";
//import {Connection} from '../spinosaurus/mod.ts'

const con1 = getTestConnection();
const testMessage = "  {}";
Deno.test(
  testMessage.replace(
    /\{\}/ig,
    "drop [drop table] execute() function should work",
  ),
  async () => {
    const db: Connection = new Connection(con1);
    const currEntity = `DropTable_${window.OBJECT_SEQUENCE++}`;
    const chk = await db.checkObject({ name: currEntity });
    if (chk.exists) {
      const drop1 = db.drop({ entity: currEntity });
      const _drop1r = await drop1.execute();
    }
    const qs = db.create({ entity: currEntity })
      .columns({ columnName: "column1", spitype: "varchar" });
    const _creater = await qs.execute();
    const _drop2 = await db.drop({ entity: currEntity }).execute();
    const chdrop = await db.checkObject({ name: currEntity });
    assert(chdrop.exists === false, `entity '${currEntity}' should be droped`);
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
