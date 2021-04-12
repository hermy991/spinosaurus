export interface ConnectionInterface {
  name: string;
  type: string;
  host: string;
  port: number;
  username: string;
  password: string,
  database: string,
  synchronize: boolean;
  entities: string;
}