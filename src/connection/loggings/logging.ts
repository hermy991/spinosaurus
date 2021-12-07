import * as path from "deno/path/mod.ts";
import * as luxon from "luxon/mod.ts";
/*
* query - logs all queries.
* error - logs all failed queries and errors.
* schema - logs the schema build process.
* warn - logs internal orm warnings.
* info - logs internal orm informative messages.
* log - logs internal orm log messages.
*/

export type LogginKey = "query" | "error" | "schema" | "warn" | "info" | "log";
export type LogginKeys = LogginKey[];

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

export type LoggingWriter = {
  file: string;
  dateTime?: Date;
  logginKey?: LogginKey;
  className?: string;
  functionName?: string;
  outLine?: string;
};

export class Logging {
  #channelChanged = false;
  #logChannel = console.log;
  constructor(private loggingOptions: LoggingOptions) {
  }

  setLogChannel(logChannel: (line: string, opts?: Record<string, any>) => void) {
    this.#logChannel = logChannel;
    this.#channelChanged = true;
  }

  async write(loggingWriter: LoggingWriter): Promise<void> {
    const tloggingWriter: LoggingWriter = self.structuredClone(loggingWriter);
    tloggingWriter.dateTime ||= new Date();
    const _dateTime = luxon.DateTime.fromJSDate(tloggingWriter.dateTime).toFormat("yyyy-MM-dd HH:mm:ss");
    const _logginKey = "- " + (tloggingWriter.logginKey || "log").toUpperCase().padEnd(7, " ");
    const _file = tloggingWriter.file || "";
    const _className = tloggingWriter.className || "";
    const _functionName = tloggingWriter.functionName || "";
    const _outLine = tloggingWriter.outLine || "";
    let locationTemplate = "";
    if (!_className || _functionName) {
      locationTemplate = "> " + [_className, _functionName].filter((x) => x).join(".");
    }
    let lineTemplate = `{{DATE_TIME}} {{LOGGING_KEY}}  {{FILE}} {{LOCATION_CALLER}} : {{OUT_LINE}}`;
    lineTemplate = lineTemplate.replace(/\{\{DATE_TIME\}\}/ig, _dateTime);
    lineTemplate = lineTemplate.replace(/\{\{LOGGING_KEY\}\}/ig, _logginKey);
    lineTemplate = lineTemplate.replace(/\{\{FILE\}\}/ig, _file);
    lineTemplate = lineTemplate.replace(/\{\{LOCATION_CALLER\}\}/ig, locationTemplate);
    lineTemplate = lineTemplate.replace(/\{\{CLASS_NAME\}\}/ig, _className);
    lineTemplate = lineTemplate.replace(/\{\{FUNCTION_NAME\}\}/ig, _functionName);
    lineTemplate = lineTemplate.replace(/\{\{OUT_LINE\}\}/ig, _outLine);
    const line = lineTemplate.replace(/\{\{*\}\}/ig, "");
    for (const key in this.loggingOptions) {
      if ((tloggingWriter.logginKey || "log") === key && this.loggingOptions[key]) {
        const loggingOption = this.loggingOptions[key];
        const tlogChannel = this.#logChannel;
        if (this.#channelChanged) {
          tlogChannel(line, tloggingWriter);
        } else if (typeof loggingOption === "string") {
          let fullPath = loggingOption;
          fullPath = loggingFileNameInterpolation(fullPath);
          await Deno.mkdir(path.dirname(fullPath), { recursive: true });
          await Deno.writeTextFile(fullPath, line + "\n", { append: true });
        } else {
          tlogChannel(line);
        }
      }
    }
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
      options[option] = true;
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
    return new Logging(options);
  } else {
    return;
  }
}

function loggingFileNameInterpolation(path: string) {
  let tpath = path;
  const regexp = /\{[a-zA-Z-_/\\ ]*\}/ig;
  const matches = tpath.match(regexp);
  if (matches) {
    for (const match of matches) {
      const format = match.split("").slice(1, match.split("").length - 1).join("");
      tpath = tpath.replace(match, luxon.DateTime.now().toFormat(format));
    }
  }
  return tpath;
}
