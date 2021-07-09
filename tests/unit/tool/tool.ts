declare global {
  var name: any;
  interface Window {
    OBJECT_SEQUENCE: any;
  }
}

window.OBJECT_SEQUENCE = 1;

let host = Deno.env.get("SPINOSAURUS_TEST_CON_HOST") || "localhost";
let port = Number(Deno.env.get("SPINOSAURUS_TEST_CON_PORT") || 5432);
let username = Deno.env.get("SPINOSAURUS_TEST_CON_USERNAME") || "neo";
let password = Deno.env.get("SPINOSAURUS_TEST_CON_PASSWORD") || "123456";

//159.89.182.194, localhost
/*** User
 userName    | firstName
---------------------------
 hermy991    | Hermy
 guru        | Danny
*/
export function getTestConnection() {
  let con1 = {
    name: "con1",
    type: "postgres",
    host,
    port,
    username,
    password,
    database: "spinosaurus_test",
    synchronize: true,
    entities: ["src/connection/entities"],
  };
  return con1;
}
