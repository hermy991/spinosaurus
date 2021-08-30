export type ConnectionOptionsBase = {
  name: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  entities: string | string[];
};

export type ConnectionOptionsPostgres = ConnectionOptionsBase & {
  type: "postgres";
  hostaddr?: string;
};

export type ConnectionOptions = ConnectionOptionsPostgres;
