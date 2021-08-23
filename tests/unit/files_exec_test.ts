import { Connection } from "spinosaurus/mod.ts";
import { getConnectionEnvOptions } from "../../src/connection/connection_utils.ts";

Deno.test("file configurations flow", async () => {
  let permission = await Deno.permissions.query({ name: "env" });
  if (permission.state === "prompt") {
    permission = await Deno.permissions.request({ name: "env" });
  }
  if (permission.state === "denied") {
    return;
  }
  console.log("envs", await getConnectionEnvOptions());
});
