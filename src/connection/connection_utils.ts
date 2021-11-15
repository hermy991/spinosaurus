import { dotenv } from "../../deps.ts";
import { yaml } from "../../deps.ts";
import { xml } from "../../deps.ts";
import { ConnectionOptions } from "./connection_options.ts";
import { error } from "../error/error_utills.ts";
import { LoggingOptions, LogginKeys } from "./logging/Logging.ts";
// import { hash } from "../../deps.ts";

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
  logging: "SPINOSAURUS_CONN_LOGGING",
};
/**
 * Reads connection options stored in spinosaurus configuration file.
 */
export async function getConnectionOptions(connectionName?: string): Promise<ConnectionOptions> {
  const fileOptions = await getConnectionEnvOptions() ||
    await getConnectionFileOptions(`.env`) ||
    await getConnectionFileOptions(`env`) ||
    await getConnectionFileOptions(`js`) ||
    await getConnectionFileOptions(`ts`) ||
    await getConnectionFileOptions(`json`) ||
    await getConnectionFileOptions(`yml`) ||
    await getConnectionFileOptions(`yaml`) ||
    await getConnectionFileOptions(`xml`);
  if (!fileOptions) {
    throw error({ name: "ErrorConnectionOptionsNotFound" });
  }
  if (Array.isArray(fileOptions)) {
    for (let i = 0; i < fileOptions.length; i++) {
      const tfileOptions = fileOptions[i];
      tfileOptions.name = tfileOptions.name || "default";
    }
  } else {
    fileOptions.name = fileOptions.name || "default";
  }
  const options = findConnection(fileOptions, connectionName);
  if (options) {
    return options;
  }
  throw error({ name: "ErrorConnectionOptionsNotFound" });
}
export async function getConnectionsOptions(): Promise<ConnectionOptions[]> {
  const fileOptions = await getConnectionEnvOptions() ||
    await getConnectionFileOptions(`.env`) ||
    await getConnectionFileOptions(`env`) ||
    await getConnectionFileOptions(`js`) ||
    await getConnectionFileOptions(`ts`) ||
    await getConnectionFileOptions(`json`) ||
    await getConnectionFileOptions(`yml`) ||
    await getConnectionFileOptions(`yaml`) ||
    await getConnectionFileOptions(`xml`);
  if (!fileOptions) {
    throw error({ name: "ErrorConnectionOptionsNotFound" });
  }
  if (Array.isArray(fileOptions)) {
    return fileOptions;
  } else {
    return [fileOptions];
  }
}

export async function getConnectionEnvOptions() {
  const options: any = {};
  let leave = false;
  for (const index in Object.entries(VARIABLES)) {
    const entry = Object.entries(VARIABLES)[index];
    let permission = await Deno.permissions.query({ name: "env", variable: entry[1] } as const);
    if (Number(index) < 3 && permission.state === "prompt") {
      permission = await Deno.permissions.request({ name: "env", variable: entry[1] });
    }
    if (Number(index) >= 3 && permission.state === "denied") {
      leave = true;
      break;
    } else if (permission.state === "granted") {
      const value = Deno.env.get(entry[1]);
      if (value === undefined || value === null || (entry[0] === "entities" && value === "")) {
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
  fileNameOrExtenxion: string | ".env" | "env" | "js" | "ts" | "json" | "yml" | "yaml" | "xml",
) {
  try {
    let name = FILE_NAME;
    let extension = fileNameOrExtenxion;
    if (fileNameOrExtenxion.indexOf(".") >= 0) {
      name = `${fileNameOrExtenxion.substring(0, fileNameOrExtenxion.lastIndexOf("."))}`;
      extension = `${extension.substring(extension.lastIndexOf(".") + 1)}`;
    }
    const fileName = `${name}.${extension}`;
    const parseEntities = (value: any) => {
      try {
        if (typeof value === "string") {
          return JSON.parse(value || "");
        } else if (typeof value === "object" && Array.isArray(value)) {
          return value;
        }
      } catch (err) {
        if (err.name === "SyntaxError") {
          return (value || "").split(",");
        }
      }
    };
    if (["js", "ts"].includes(extension)) {
      const path = `file:///${Deno.cwd()}/${fileName}`;
      const module: any = await import(path);
      const options = module.default;
      if (Array.isArray(options)) {
        for (let i = 0; i < options.length; i++) {
          const toptions = options[i];
          if (toptions.entity) {
            toptions.entity = parseEntities(toptions.entities);
          }
        }
      }
      if (options.entity) {
        options.entity = parseEntities(options.entities);
      }
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
            let value = tdata[(<any> VARIABLES)[index]];
            if (value === undefined || value === null || (index === "entities" && value === "")) {
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
                ndata[index] = parseEntities(ndata[index]);
                break;
              case "logging":
                {
                  value = value.trim();
                  if (value === "true" || value === "false") {
                    /**
                     * Check if value is a boolean
                     * options:
                     *   true
                     *   false
                     */
                    ndata[index] = value === "true";
                  } else if (typeof value === "string" && value) {
                    let otype = 0;
                    const loptions: LoggingOptions = {};
                    const lkeys: LogginKeys = [];
                    for (const vx of value.split(",")) {
                      if ((vx.split(":").length > 1 || vx.split("=").length > 1) && [0, 1].indexOf(otype)) {
                        otype = 1;
                        /**
                         * Check if value is a json
                         * options:
                         *   all: ./logs/app.log
                         *   query = ./logs/query.log, info = ./logs/info-{yyyy}-{MM}-{dd}.log
                         *   all: true, info = ./logs/info-{yyyy}-{MM}-{dd}.log
                         */
                        const [p1, p2] = vx.split(":").length > 1 ? vx.split(":") : vx.split("=");
                        const vp2 = p2 === "true" ? true : p2 === "false" ? false : p2.trim();
                        if (vp2) {
                          switch (p1) {
                            case "all":
                              loptions[<"query"> p1] = vp2;
                              break;
                            case "query":
                              loptions[p1] = vp2;
                              break;
                            case "error":
                              loptions[p1] = vp2;
                              break;
                            case "schema":
                              loptions[p1] = vp2;
                              break;
                            case "warn":
                              loptions[p1] = vp2;
                              break;
                            case "info":
                              loptions[p1] = vp2;
                              break;
                            case "log":
                              loptions[p1] = vp2;
                              break;
                          }
                        }
                      } else if ([0, 2].indexOf(otype)) {
                        otype = 2;
                        /**
                         * Check if value is a array
                         * options:
                         *   query ,error,schema , warn, info, log
                         */
                        switch (vx) {
                          case "all":
                            lkeys.push(<"query"> vx);
                            break;
                          case "query":
                            lkeys.push(vx);
                            break;
                          case "error":
                            lkeys.push(vx);
                            break;
                          case "schema":
                            lkeys.push(vx);
                            break;
                          case "warn":
                            lkeys.push(vx);
                            break;
                          case "info":
                            lkeys.push(vx);
                            break;
                          case "log":
                            lkeys.push(vx);
                            break;
                        }
                      }
                    }
                    if (otype === 1) {
                      ndata[index] = loptions;
                    } else if (otype === 2) {
                      ndata[index] = lkeys;
                    }
                  } else {
                    ndata[index] = false;
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
            if (value === undefined || value === null || (index === "entities" && value === "")) {
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
                ndata[index] = parseEntities(ndata[index]);
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

export function findConnection(options: any | Array<any>, name?: string) {
  if (!options) {
    return;
  }
  if (Array.isArray(options)) {
    let toptions = options.find((x) => x["name"] === name);
    if (!toptions) {
      toptions = options.find((x) => !name && x["name"] === "default");
    }
    if (!toptions) {
      toptions = options.find(() => !name);
    }
    return toptions;
  } else if (!name || options["name"] === name) {
    return options;
  }
}
