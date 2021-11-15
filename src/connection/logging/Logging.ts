/*
* query - logs all queries.
* error - logs all failed queries and errors.
* schema - logs the schema build process.
* warn - logs internal orm warnings.
* info - logs internal orm informative messages.
* log - logs internal orm log messages.
*/

export type LogginKeys = ("query" | "error" | "schema" | "warn" | "info" | "log")[];

export type LoggingOptions = {
  query?: string | true;
  error?: string | true;
  schema?: string | true;
  warn?: string | true;
  info?: string | true;
  log?: string | true;
  // ["query" | "error" | "schema" | "warn" | "info" | "log"]?: string | true;
};

export type ParamLoggingOptions =
  | Record<"all", string | true>
  | LoggingOptions;

export class Logging {
  constructor(private opts: LoggingOptions) {
  }
}

export function createLogging(enabled: boolean): Logging | undefined;

export function createLogging(options: ParamLoggingOptions): Logging | undefined;

export function createLogging(arrayOptions: LogginKeys): Logging | undefined;

export function createLogging(
  enabledOptionsArrayOptions: boolean | ParamLoggingOptions | LogginKeys,
): Logging | undefined;

export function createLogging(
  enabledOptionsArrayOptions: boolean | ParamLoggingOptions | LogginKeys,
): Logging | undefined {
  const fileName = "spinosaurus";
  const extension = "log";
  const defaultPath = `./${fileName}.${extension}`;
  const keys: LogginKeys = ["query", "error", "schema", "warn", "info", "log"];
  const options: LoggingOptions = {};
  if (typeof enabledOptionsArrayOptions === "boolean") {
    for (const option of keys) {
      options[option] = defaultPath;
    }
    return new Logging(options);
  } else if (Array.isArray(enabledOptionsArrayOptions)) {
    for (const option of enabledOptionsArrayOptions) {
      options[option] = defaultPath;
    }
    return new Logging(options);
  } else if (typeof enabledOptionsArrayOptions === "object") {
    for (const key in enabledOptionsArrayOptions) {
      if (key === "all") {
        for (const vk of keys) {
          options[vk] = (<any> enabledOptionsArrayOptions)[key];
        }
      } else {
        options[<"query" | "error" | "schema" | "warn" | "info" | "log"> key] = (<any> enabledOptionsArrayOptions)[key];
      }
    }
  } else {
    return;
  }
}
