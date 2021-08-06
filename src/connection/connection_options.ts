import { ConnectionPostgresOptions } from "./drivers/postgres/connection_postgres_options.ts";

export type ConnectionBaseOptions = {
  name: string;
  type: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  entities: string | string[];
};

export type { ConnectionPostgresOptions };

export type ConnectionOptionsAll = ConnectionPostgresOptions;
