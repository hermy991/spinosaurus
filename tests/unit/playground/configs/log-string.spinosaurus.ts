export default {
  name: "neo",
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "neo",
  password: "hermyde5166",
  database: "neo2",
  synchronize: true,
  entities: ["src/entities/**/*.ts"],
  logging: "logs/log-{yyyy-MM-dd}.log",
};
