import { LogginKeys, ParamLoggingOptions } from "./logging/Logging.ts";

export type ConnectionOptionsBase = {
  name: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  entities: string | string[];
  logging?: ParamLoggingOptions | boolean | LogginKeys;
};

export type ConnectionOptionsPostgres = ConnectionOptionsBase & {
  type: "postgres";
  hostaddr?: string;
};

export type ConnectionOptions = ConnectionOptionsPostgres;
