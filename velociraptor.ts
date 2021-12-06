const imap = `./tests/importmap.json`;
const tsconfig = `./config.json`;
const folder = "tests/unit/";
const allow = {
  net: true,
  read: "./",
  write: "./",
  env: [
    `SPINOSAURUS_TEST_CONN_HOST`,
    `SPINOSAURUS_TEST_CONN_PORT`,
    `SPINOSAURUS_TEST_CONN_USERNAME`,
    `SPINOSAURUS_TEST_CONN_PASSWORD`,
  ].join(","),
};
const sqls = [
  `${folder}create_sql_test.ts`,
  `${folder}alter_sql_test.ts`,
  `${folder}drop_sql_test.ts`,
  `${folder}rename_sql_test.ts`,
  `${folder}select_sql_test.ts`,
  `${folder}insert_sql_test.ts`,
  `${folder}update_sql_test.ts`,
  `${folder}delete_sql_test.ts`,
  `${folder}upsert_sql_test.ts`,
  `${folder}from_sql_test.ts`,
  `${folder}join_inner_sql_test.ts`,
  `${folder}join_left_sql_test.ts`,
  `${folder}join_right_sql_test.ts`,
  `${folder}params_sql_test.ts`,
  `${folder}function_sql_test.ts`,
  `${folder}decorator_column_sql_test.ts`,
  `${folder}decorator_entity_sql_test.ts`,
  `${folder}transaction_sql_test.ts`,
  `${folder}logging_sql_test.ts`,
];
const execs = [
  `${folder}files_exec_test.ts`,
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
const opts = ["--unsafely-ignore-certificate-errors=localhost"];
export default {
  scripts: {
    "test": {
      desc: "Run all test",
      imap,
      tsconfig,
      unstable: true,
      allow,
      cmd: `deno test ${opts.join(" ")} "${[...sqls, ...execs].join(`" "`)}" `,
    },
    "test:one": {
      desc: "Run one test",
      imap,
      tsconfig,
      unstable: true,
      allow,
      cmd: `deno test ${opts.join(" ")} `,
    },
    "test:sql": {
      desc: "Run sql test",
      imap,
      tsconfig,
      unstable: true,
      allow,
      cmd: `deno test ${opts.join(" ")} "${sqls.join(`" "`)}" `,
    },
    "test:exec": {
      desc: "Run executors test",
      imap,
      tsconfig,
      unstable: true,
      allow,
      cmd: `deno test ${opts.join(" ")} "${execs.join(`" "`)}" `,
    },
  },
};
