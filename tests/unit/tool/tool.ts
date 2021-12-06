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

export async function clearPlayground(db: any, tables: Array<any>, schemas: Array<any>) {
  /**
   * Dropping tables
   */
  for (const table of tables) {
    const co = await db.checkObject(table.mixeds);
    if (co.exists) {
      const t = { entity: co.name, schema: co.schema };
      await db.drop(t).execute();
    }
  }
  /**
   * Dropping schemas
   */
  for (const schema of schemas) {
    const cs = await db.checkSchema({ name: schema.name });
    if (cs.exists) {
      const t = { schema: cs.name, check: true };
      await db.drop(t).execute();
    }
  }
}
