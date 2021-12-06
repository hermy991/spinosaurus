// import { Connection } from "spinosaurus/mod.ts";
import { getConnectionEnvOptions, getConnectionFileOptions } from "../../src/connection/connection_utils.ts";
import { copy } from "deno/fs/mod.ts";
import { assertEquals } from "deno/testing/asserts.ts";

Deno.test("file standar configurations", async () => {
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
    delete envOpts["logging"];
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
  const path = "./tests/unit/playground/configs/";
  const files = [
    `.env`,
    `spinosaurus.env`,
    `spinosaurus.js`,
    `spinosaurus.ts`,
    `spinosaurus.json`,
    `spinosaurus.yml`,
    `spinosaurus.yaml`,
    `spinosaurus.xml`,
  ];
  for (const file of files) {
    await copy(`${path}${file}`, `./${file}`, { overwrite: true });
  }
  const fenvOpts1 = await getConnectionFileOptions(".env");
  assertEquals(fenvOpts1, opts);
  const fenvOpts2 = await getConnectionFileOptions("env");
  assertEquals(fenvOpts2, opts);
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
  for (const file of files) {
    await Deno.remove(`./${file}`);
  }
});
Deno.test("file logging configurations", async () => {
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
      "logging",
    ];
    const envOpts = await getConnectionEnvOptions();
    assertEquals(Object.keys(envOpts), enve);
  }
  const opts: any = {
    name: "neo",
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "neo",
    password: "hermyde5166",
    database: "neo2",
    synchronize: true,
    entities: ["src/entities/**/*.ts"],
    // logging: "logs/log-{yyyy-MM-dd}.log",
  };
  const samples: any = { string: "logs/log-{yyyy-MM-dd}.log", true: true };
  const path = "./tests/unit/playground/configs/";
  const files = [
    `spinosaurus.env`,
    `spinosaurus.js`,
    `spinosaurus.ts`,
    `spinosaurus.json`,
    `spinosaurus.yml`,
    `spinosaurus.yaml`,
    `spinosaurus.xml`,
  ];
  for (const key in samples) {
    opts["logging"] = samples[key];
    for (const file of files) {
      console.log(`${path}log-${key}.${file}`);
      await copy(`${path}log-${key}.${file}`, `./${file}`, { overwrite: true });
    }
    // const fenvOpts1 = await getConnectionFileOptions(".env");
    // assertEquals(fenvOpts1, opts);
    const fenvOpts2 = await getConnectionFileOptions("env");
    assertEquals(fenvOpts2, opts);
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
    for (const file of files) {
      await Deno.remove(`./${file}`);
    }
  }
});
