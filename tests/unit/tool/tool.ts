declare global {
  var name: any;
  interface Window {
    OBJECT_SEQUENCE: any;
  }
}

window.OBJECT_SEQUENCE = 1;

const host = Deno.env.get("SPINOSAURUS_TEST_CONN_HOST") || "localhost";
const port = Number(Deno.env.get("SPINOSAURUS_TEST_CONN_PORT") || 5432);
const username = Deno.env.get("SPINOSAURUS_TEST_CONN_USERNAME") || "neo";
const password = Deno.env.get("SPINOSAURUS_TEST_CONN_PASSWORD") || "123456";

//159.89.182.194, localhost
/*** User
 userName    | firstName
---------------------------
 hermy991    | Hermy
 guru        | Danny
*/
export function getTestConnection(): any {
  const con1 = {
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
