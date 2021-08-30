import { dotenv } from "../../deps.ts";
import { yaml } from "../../deps.ts";
import { xml } from "../../deps.ts";
import { ConnectionOptionsAll } from "./connection_options.ts";
import { error } from "../error/error_utills.ts";

const FILE_NAME = "spinosaurus";

const VARIABLES = {
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
/**
 * Reads connection options stored in spinosaurus configuration file.
 */
export async function getConnectionOptions(
  connectionName?: string,
): Promise<ConnectionOptionsAll> {
  const options = findConnection(
    await getConnectionEnvOptions() ||
      await getConnectionFileOptions(`.env`) ||
      await getConnectionFileOptions(`env`) ||
      await getConnectionFileOptions(`js`) ||
      await getConnectionFileOptions(`ts`) ||
      await getConnectionFileOptions(`json`) ||
      await getConnectionFileOptions(`yml`) ||
      await getConnectionFileOptions(`yaml`) ||
      await getConnectionFileOptions(`xml`),
    connectionName,
  );
  if (options) {
    return options;
  }
  throw error({ name: "ErrorConnectionOptionsNotFound" });
}

export async function getConnectionEnvOptions() {
  const options: any = {};
  let leave = false;
  for (const index in Object.entries(VARIABLES)) {
    const entry = Object.entries(VARIABLES)[index];
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
      const value = Deno.env.get(entry[1]);
      if (
        value === undefined ||
        value === null ||
        (entry[0] === "entities" && value === "")
      ) {
        continue;
      }
      switch (entry[0]) {
        case "port":
          options[entry[0]] = Number(value);
          break;
        case "synchronize":
          options[entry[0]] = value === "true";
          break;
        case "entities":
          {
            try {
              options[entry[0]] = JSON.parse(value || "");
            } catch (err) {
              if (err.name === "SyntaxError") {
                options[entry[0]] = (value || "").split(",");
              }
            }
          }
          break;
        default:
          options[entry[0]] = value;
      }
    }
  }
  if (leave) {
    return;
  }
  return options;
}

export async function getConnectionFileOptions(
  fileNameOrExtenxion:
    | string
    | ".env"
    | "env"
    | "js"
    | "ts"
    | "json"
    | "yml"
    | "yaml"
    | "xml",
) {
  try {
    let name = FILE_NAME;
    let extension = fileNameOrExtenxion;

    if (fileNameOrExtenxion.indexOf(".") >= 0) {
      name = `${
        fileNameOrExtenxion.substring(0, fileNameOrExtenxion.lastIndexOf("."))
      }`;
      extension = `${extension.substring(extension.lastIndexOf(".") + 1)}`;
    }
    const fileName = `${name}.${extension}`;
    if (["js", "ts"].includes(extension)) {
      const path = `file:///${Deno.cwd()}/${fileName}`;
      const module: any = await import(path);
      const options = module.default;
      return options;
    } else {
      const decoder = new TextDecoder("utf-8");
      const raw = Deno.readFileSync(`${Deno.cwd()}/${fileName}`);
      const text = decoder.decode(raw);
      switch (extension) {
        case "env": {
          const tdata = dotenv.dotEnvParser(text);
          const ndata: any = {};
          for (const index in VARIABLES) {
            const value = tdata[(<any> VARIABLES)[index]];
            if (
              value === undefined ||
              value === null ||
              (index === "entities" && value === "")
            ) {
              continue;
            }
            switch (index) {
              case "port":
                ndata[index] = Number(value);
                break;
              case "synchronize":
                ndata[index] = value === "true";
                break;
              case "entities":
                {
                  try {
                    ndata[index] = JSON.parse(value || "");
                  } catch (err) {
                    if (err.name === "SyntaxError") {
                      ndata[index] = (value || "").split(",");
                    }
                  }
                }
                break;
              default:
                ndata[index] = value;
            }
          }
          return ndata;
        }
        case "json":
          return JSON.parse(text);
        case "yml":
        case "yaml":
          return yaml.parse(text);
        case "xml": {
          const tdata = <any> xml.parse(text);
          const ndata: any = {};
          for (const index in tdata.connection) {
            const value = tdata.connection[index];
            if (
              value === undefined ||
              value === null ||
              (index === "entities" && value === "")
            ) {
              continue;
            }

            switch (index) {
              case "port":
                ndata[index] = Number(value);
                break;
              case "synchronize":
                ndata[index] = (value + "") === "true";
                break;
              case "entities":
                {
                  try {
                    ndata[index] = JSON.parse(value || "");
                  } catch (err) {
                    if (err.name === "SyntaxError") {
                      ndata[index] = (value || "").split(",");
                    }
                  }
                }
                break;
              default:
                ndata[index] = value;
            }
          }
          return ndata;
        }
      }
    }
  } catch (err) {
    return;
  }
  return;
}

function findConnection(options: any | Array<any>, name?: string) {
  if (!options) {
    return;
  }
  if (Array.isArray(options)) {
    const toptions = options.find((x) => !name || x["name"] === name);
    return toptions;
  } else if (!name || options["name"] === name) {
    return options;
  }
}
