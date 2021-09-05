import { getTestConnection } from "./tool/tool.ts";
import { Connection } from "spinosaurus/mod.ts";
import { assertEquals } from "deno/testing/asserts.ts";
import * as luxon from "luxon/mod.ts";

const con1 = getTestConnection();

Deno.test("upsert [upsert 'Entity'] sql", async () => {
  const { UpsertEntity1, UpsertEntity2 } = await import(
    "./playground/decorators/UpsertEntity.ts"
  );
  const db: Connection = new Connection(con1);
  const updateColumn = new Date();
  const values = [{
    primaryGeneratedColumn: 1,
    column2: "ss",
    column3: "sss",
    versionColumn: 2,
    updateColumn,
  }, {
    column2: "ss",
    column3: "sss",
    versionColumn: 2,
    updateColumn,
  }];
  const qs1 = db.upsert(UpsertEntity1)
    .values(values);
  const q1 = qs1.getSql();
  const qe1 =
    `UPDATE "schema"."UpsertEntityCustom" SET "column2" = 'ss', "columnCustom" = 'sss', "versionColumn" = 2, "updateColumn" = TO_TIMESTAMP('${
      luxon.DateTime.fromJSDate(updateColumn).toFormat("yyyy-MM-dd HH:mm:ss")
    }', 'YYYY-MM-DD HH24:MI:SS') WHERE "primaryGeneratedColumn" = 1;
INSERT INTO "schema"."UpsertEntityCustom" ("column2", "columnCustom", "versionColumn", "updateColumn") VALUES ('ss', 'sss', 2, TO_TIMESTAMP('${
      luxon.DateTime.fromJSDate(updateColumn).toFormat("yyyy-MM-dd HH:mm:ss")
    }', 'YYYY-MM-DD HH24:MI:SS'))`;
  assertEquals(q1, qe1);

  for (const value of values) {
    delete (<any> value).versionColumn;
    delete (<any> value).updateColumn;
  }
  const qs2 = db.upsert(UpsertEntity2)
    .values(values);
  let q2 = qs2.getSql();
  const qe2 =
    `UPDATE "schema"."UpsertEntity2" SET "column2" = 'ss', "columnCustom" = 'sss', "versionColumn" = "versionColumn" + 1, "updateColumn" = now() WHERE "primaryGeneratedColumn" = 1;
INSERT INTO "schema"."UpsertEntity2" ("column2", "columnCustom") VALUES ('ss', 'sss')`;
  assertEquals(q2, qe2);
});
