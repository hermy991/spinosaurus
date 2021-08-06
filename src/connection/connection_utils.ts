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
  const permission = await Deno.permissions.query({ name: "env" } as const);
  if (
    permission.state === "granted" &&
    Deno.env.get("SPINOSAURUS_CONN_TYPE") &&
    Deno.env.get("SPINOSAURUS_CONN_NAME") &&
    Deno.env.get("SPINOSAURUS_CONN_HOST")
  ) {
    const options: ConnectionOptionsAll = <ConnectionOptionsAll> {
      type: Deno.env.get("SPINOSAURUS_CONN_TYPE") || "",
      name: Deno.env.get("SPINOSAURUS_CONN_NAME") || "",
      host: Deno.env.get("SPINOSAURUS_CONN_HOST") || "",
      port: Number(Deno.env.get("SPINOSAURUS_CONN_PORT")),
      username: Deno.env.get("SPINOSAURUS_CONN_USERNAME") || "",
      password: Deno.env.get("SPINOSAURUS_CONN_PASSWORD") || "",
      database: Deno.env.get("SPINOSAURUS_CONN_DATABASE") || "",
      synchronize: Deno.env.get("SPINOSAURUS_CONN_SYNCHRONIZE") &&
          Deno.env.get("SPINOSAURUS_CONN_SYNCHRONIZE")?.toLowerCase().trim() ==
            "true"
        ? true
        : false,
      entities: JSON.parse(Deno.env.get("SPINOSAURUS_CONN_ENTITIES") || "[]") ||
        [],
    };
    if (options.entities.length) {
      const tentities = [];
      for (let i = 0; i < options.entities.length; i++) {
        if (/^(\/)|(:)/ig.test(options.entities[i])) {
          tentities.push(`${options.entities[i]}`);
        } else {
          tentities.push(`${Deno.cwd()}/${options.entities[i]}`);
        }
      }
      options.entities = tentities;
    }
    return options;
  } else {
    return;
  }
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
