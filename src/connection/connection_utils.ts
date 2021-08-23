import { dotenv } from "../../deps.ts";
import { yaml } from "../../deps.ts";
import { xml } from "../../deps.ts";
import { ConnectionOptionsAll } from "./connection_options.ts";
import { error } from "../error/error_utills.ts";

const FILE_NAME = "spinosaurus";

export async function getConnectionOptions(
  connectionName: string,
): Promise<ConnectionOptionsAll> {
  const options = findConnection(
    await getConnectionEnvOptions() ||
      await getConnectionFileOptions("env") ||
      await getConnectionFileOptions("js") ||
      await getConnectionFileOptions("ts") ||
      await getConnectionFileOptions("json") ||
      await getConnectionFileOptions("yml") ||
      await getConnectionFileOptions("yaml") ||
      await getConnectionFileOptions("xml"),
    connectionName,
  );
  if (options) {
    return options;
  }
  throw error({ name: "ErrorConnectionOptionsNotFound" });
}

export async function getConnectionEnvOptions() {
  const variables = {
    name: "SPINOSAURUS_CONN_NAME",
    type: "SPINOSAURUS_CONN_TYPE",
    host: "SPINOSAURUS_CONN_HOST",
    port: "SPINOSAURUS_CONN_PORT",
    username: "SPINOSAURUS_CONN_USERNAME",
    password: "SPINOSAURUS_CONN_PASSWORD",
    database: "SPINOSAURUS_CONN_DATABASE",
    synchronize: "SPINOSAURUS_CONN_SYNCHRONIZE",
    entities: "SPINOSAURUS_CONN_ENTITIES",
  };
  const options: any = {};
  let leave = false;
  for (const index in Object.entries(variables)) {
    const entry = Object.entries(variables)[index];
    let permission = await Deno.permissions.query(
      { name: "env", variable: entry[1] } as const,
    );
    if (Number(index) < 3 && permission.state === "prompt") {
      permission = await Deno.permissions.request({
        name: "env",
        variable: entry[1],
      });
    }
    if (Number(index) >= 3 && permission.state === "denied") {
      leave = true;
      break;
    } else if (permission.state === "granted") {
      console.log(
        "entities",
        entry,
        "Deno.env.get(entry[1])",
        Deno.env.get(entry[1]),
      );
      if (
        Deno.env.get(entry[1]) === undefined ||
        Deno.env.get(entry[1]) === null
      ) {
        continue;
      }
      switch (entry[0]) {
        case "port":
          options[entry[0]] = Number(Deno.env.get(entry[1]));
          break;
        case "synchronize":
          Deno.env.get(entry[1]) === "true"
            ? options[entry[0]] = Deno.env.get(entry[1])
            : undefined;
          break;
        case "entities":
          options[entry[0]] = JSON.parse(Deno.env.get(entry[1]) + "");
          break;
        default:
          options[entry[0]] = Deno.env.get(entry[1]);
      }
    }
  }
  if (leave) {
    return;
  }
  return options;
}

export async function getConnectionFileOptions(
  extension: "env" | "js" | "ts" | "json" | "yml" | "yaml" | "xml",
) {
  try {
    if (["js", "ts"].includes(extension)) {
      const options: ConnectionOptionsAll = await import(
        `${Deno.cwd()}/${FILE_NAME}.${extension}`
      );
      return options;
    } else {
      const decoder = new TextDecoder("utf-8");
      const raw = Deno.readFileSync(`${Deno.cwd()}/${FILE_NAME}.${extension}`);
      const text = decoder.decode(raw);
      switch (extension) {
        case "env":
          return dotenv.dotEnvParser(text);
        case "json":
          return JSON.parse(text);
        case "yml":
        case "yaml":
          return yaml.parse(text);
        case "xml":
          return xml.parse(text);
      }
    }
  } catch (err) {
    return;
  }
  return;
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
