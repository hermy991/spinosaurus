const imap = `./tests/importmap.json`;
const tsconfig = `./tests/tsconfig.json`;
const folder = "tests/unit/";
const envs = [
  `SPINOSAURUS_TEST_CONN_HOST`,
  `SPINOSAURUS_TEST_CONN_PORT`,
  `SPINOSAURUS_TEST_CONN_USERNAME`,
  `SPINOSAURUS_TEST_CONN_PASSWORD`,
];
const sqls = [
  `${folder}create_sql_test.ts`,
  `${folder}alter_sql_test.ts`,
  `${folder}drop_sql_test.ts`,
  `${folder}rename_sql_test.ts`,
  `${folder}select_sql_test.ts`,
  `${folder}insert_sql_test.ts`,
  `${folder}update_sql_test.ts`,
  `${folder}delete_sql_test.ts`,
  `${folder}join_sql_test.ts`,
  `${folder}function_sql_test.ts`,
  `${folder}decorator_column_sql_test.ts`,
  `${folder}decorator_entity_sql_test.ts`,
];
const execs = [
  `${folder}create_exec_test.ts`,
  `${folder}drop_exec_test.ts`,
  `${folder}rename_exec_test.ts`,
  `${folder}select_exec_test.ts`,
  `${folder}insert_exec_test.ts`,
  `${folder}update_exec_test.ts`,
  `${folder}delete_exec_test.ts`,
  `${folder}decorator_entity_exec_test.ts`,
  `${folder}decorator_column_exec_test.ts`,
];
export default {
  scripts: {
    "test": {
      desc: "Run all test",
      imap,
      tsconfig,
      unstable: true,
      allow: {
        net: true,
        read: "./",
        env: envs.join(","),
      },
      cmd: `deno test --unsafely-ignore-certificate-errors=localhost "${
        [...sqls, ...execs].join(`" "`)
      }" `,
    },
    "test:one": {
      desc: "Run one test",
      imap,
      tsconfig,
      unstable: true,
      allow: {
        net: true,
        read: "./",
        env: envs.join(","),
      },
      cmd: "deno test --unsafely-ignore-certificate-errors=localhost ",
    },
    "test:sql": {
      desc: "Run sql test",
      imap,
      tsconfig,
      unstable: true,
      allow: {
        net: true,
        read: "./",
        env: envs.join(","),
      },
      cmd: `deno test --unsafely-ignore-certificate-errors=localhost "${
        sqls.join(`" "`)
      }" `,
    },
    "test:executor": {
      desc: "Run executors test",
      imap,
      tsconfig,
      unstable: true,
      allow: {
        net: true,
        read: "./",
        env: envs.join(","),
      },
      cmd: `deno test --unsafely-ignore-certificate-errors=localhost "${
        execs.join(`" "`)
      }" `,
    },
  },
};
