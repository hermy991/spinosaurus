import {getTestConnection} from "./tool/tool.ts";
import { /*Connection, */createConnection, getMetadata } from "spinosaurus/mod.ts";
import * as path from "deno/path/mod.ts";

let con1 = getTestConnection();

const testMessage = "  {}";

Deno.test(testMessage.replace(/\{\}/ig, "decorator entity should work"), async () => {
  let conX = JSON.parse(JSON.stringify(con1));
  // const __filename = path.fromFileUrl(import.meta.url);
  const dirname = path.dirname(path.fromFileUrl(import.meta.url));

  // console.log(`\n__filename`, __filename);
  // console.log(`__dirname`, __dirname);

  // conX.entities = [new URL(".", import.meta.url).pathname + "playground/decorators/user.entity.ts"];
  conX.entities = [`${dirname}/playground/decorators/**/*.ts`];
  await createConnection(conX);
  let metadata = getMetadata();
  // console.log(metadata);
  // console.log(`ColumnTest1 = `, new ColumnTest1());

  // console.log("\n");
  // console.log(`import.meta.url = `, import.meta.url);
  // console.log(`new URL("", import.meta.url).pathname = `, new URL("", import.meta.url).pathname);
  // console.log(`new URL(".", import.meta.url).pathname = `, new URL(".", import.meta.url).pathname);
  // console.log("import.meta.main : ", import.meta.main);
  // console.log("");

  //assertEquals(query, querySpected);
});
