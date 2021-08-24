import { Connection } from "spinosaurus/mod.ts";
import {
  getConnectionEnvOptions,
  getConnectionFileOptions,
} from "../../src/connection/connection_utils.ts";
import { copy } from "deno/fs/mod.ts";
import { assertEquals } from "deno/testing/asserts.ts";

Deno.test("file configurations data", async () => {
  let permission = await Deno.permissions.query({ name: "env" });
  if (permission.state === "prompt") {
    permission = await Deno.permissions.request({ name: "env" });
  }
  if (permission.state !== "denied") {
    const enve = [
      "name",
      "type",
      "host",
      "port",
      "username",
      "password",
      "database",
      "synchronize",
      "entities",
    ];
    const envOpts = await getConnectionEnvOptions();
    assertEquals(Object.keys(envOpts), enve);
  }
  const opts = {
    name: "neo",
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "neo",
    password: "hermyde5166",
    database: "neo2",
    synchronize: true,
    entities: ["src/entities/**/*.ts"],
  };
  const path = "./playground/configs/";
  const files = [
    `${path}spinosaurus.env`,
    `${path}spinosaurus.js`,
    `${path}spinosaurus.ts`,
    `${path}spinosaurus.json`,
    `${path}spinosaurus.yml`,
    `${path}spinosaurus.yaml`,
    `${path}spinosaurus.xml`,
  ];
  files.forEach((file) => copy(file, `.${file}`, { overwrite: true }));
  const fenvOpts = await getConnectionFileOptions("env");
  assertEquals(fenvOpts, opts);
  const fjsOpts = await getConnectionFileOptions("js");
  assertEquals(fjsOpts, opts);
  const ftsOpts = await getConnectionFileOptions("ts");
  assertEquals(ftsOpts, opts);
  const fjsonOpts = await getConnectionFileOptions("json");
  assertEquals(fjsonOpts, opts);
  const fymlOpts = await getConnectionFileOptions("yml");
  assertEquals(fymlOpts, opts);
  const fyamlOpts = await getConnectionFileOptions("yaml");
  assertEquals(fyamlOpts, opts);
  const fxmlOpts = await getConnectionFileOptions("xml");
  assertEquals(fxmlOpts, opts);
});
