import { IConnectionOptions } from "../iconnection_options.ts";
export interface IConnectionPostgresOptions extends IConnectionOptions {
  hostaddr?: string;
}
