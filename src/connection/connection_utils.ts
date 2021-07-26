// name: string;
//   type: string;
//   host: string;
//   port: number;
//   username: string;
//   password: string;
//   database: string;
//   synchronize: boolean;
//   entities: string | string[];

import { dotenv } from "../../deps.ts";
import { yaml } from "../../deps.ts";
import { xml } from "../../deps.ts";
import { ConnectionOptions } from "./connection_options.ts";
import { ConnectionPostgresOptions } from "./postgres/connection_postgres_options.ts";
import { error } from "../error/error_utills.ts";

const FILE_NAME = "spinosaurus";

export async function getConnectionOptions(
  connectionName: string,
): Promise<ConnectionPostgresOptions> {
  const env = findConnection(await getConnectionEnvOptions(), connectionName);
  if (env) return env;
  const envf = findConnection(
    await getConnectionFileOptions("env"),
    connectionName,
  );
  if (envf) return envf;
  const js = findConnection(
    await getConnectionFileOptions("js"),
    connectionName,
  );
  if (js) return js;
  const ts = findConnection(
    await getConnectionFileOptions("ts"),
    connectionName,
  );
  if (ts) return ts;
  const json = findConnection(
    await getConnectionFileOptions("json"),
    connectionName,
  );
  if (json) return json;
  const yml = findConnection(
    await getConnectionFileOptions("yml"),
    connectionName,
  );
  if (yml) return yml;
  const yaml = findConnection(
    await getConnectionFileOptions("yaml"),
    connectionName,
  );
  if (yaml) return yaml;
  const xml = findConnection(
    await getConnectionFileOptions("xml"),
    connectionName,
  );
  if (xml) return yaml;
  throw error({ name: "ErrorConnectionNotFound" });
}

export async function getConnectionEnvOptions() {
  let options: ConnectionOptions;
  const permission = await Deno.permissions.query({ name: "env" } as const);
  if (permission.state === "granted" && Deno.env.get("SPINOSAURUS_CONN_HOST")) {
    options = {
      type: Deno.env.get("SPINOSAURUS_CONN_TYPE") || "",
      name: Deno.env.get("SPINOSAURUS_CONN_NAME") || "",
      host: Deno.env.get("SPINOSAURUS_CONN_HOST") || "",
      port: Number(Deno.env.get("SPINOSAURUS_CONN_PORT")),
      username: Deno.env.get("SPINOSAURUS_CONN_USERNAME") || "",
      password: Deno.env.get("SPINOSAURUS_CONN_PASSWORD") || "",
      database: Deno.env.get("SPINOSAURUS_CONN_DATABASE") || "",
      synchronize: Deno.env.get("SPINOSAURUS_CONN_SYNCHRONIZE") ? true : false,
      entities: Deno.env.get("SPINOSAURUS_CONN_ENTITIES")?.split(",") || [],
    };
    return options;
  } else {
    return;
  }
}

export async function getConnectionFileOptions(
  extension: "env" | "js" | "ts" | "json" | "yml" | "yaml" | "xml",
) {
  /**
   * export default
   */
  if (["env"].includes(extension)) {
    const decoder = new TextDecoder("utf-8");
    const raw = Deno.readFileSync(`${Deno.cwd()}/${FILE_NAME}.${extension}`);
    const text = decoder.decode(raw);
    const options = dotenv.dotEnvParser(text);
    return options;
  } else if (["js", "ts"].includes(extension)) {
    const options: ConnectionOptions = await import(
      `${Deno.cwd()}/${FILE_NAME}.${extension}`
    );
    return options;
  } else if (["json"].includes(extension)) {
    const decoder = new TextDecoder("utf-8");
    const raw = Deno.readFileSync(`${Deno.cwd()}/${FILE_NAME}.${extension}`);
    const text = decoder.decode(raw);
    const options = JSON.parse(text);
    return options;
  } else if (["yml", "yaml"].includes(extension)) {
    const decoder = new TextDecoder("utf-8");
    const raw = Deno.readFileSync(`${Deno.cwd()}/${FILE_NAME}.${extension}`);
    const text = decoder.decode(raw);
    const options = yaml.parse(text);
    return options;
  } else if (["xml"].includes(extension)) {
    const decoder = new TextDecoder("utf-8");
    const raw = Deno.readFileSync(`${Deno.cwd()}/${FILE_NAME}.${extension}`);
    const text = decoder.decode(raw);
    const options = xml.parse(text);
    return options;
  }
}

function findConnection(options: any | Array<any>, name: string) {
  if (!options) {
    return;
  }
  if (Array.isArray(options)) {
    const toptions = options.find((x) => x["name"] === name);
    return toptions;
  } else if (options["name"] === name) {
    return options;
  }
}
