import { ConnectionBaseOptions } from "../../connection_options.ts";

export type ConnectionPostgresOptions = ConnectionBaseOptions & {
  type: "postgres";
  hostaddr?: string;
};
