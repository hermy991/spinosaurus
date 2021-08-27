import { getTestConnection } from "./tool/tool.ts";
import { Connection } from "spinosaurus/mod.ts";
import { assertEquals } from "deno/testing/asserts.ts";
// import { ForeinghEntity } from "./playground/decorators/AlterEntity.ts";

const con1 = getTestConnection();
/*********************
 * ENTITY DDL QUERY
 *********************/
Deno.test("alter [alter relations] sql", async () => {
  const db: Connection = new Connection(con1);
  let q1 = db.alter({ schema: "publicX", entity: "User" })
    .relations(["FK_publicX_User_AnotherEntity1", {
      columns: ["AnotherEntity1Column_ID"],
      parentEntity: "AnotherEntity1",
    }])
    .addRelation(["FK_publicX_User_AnotherEntity2", {
      name: "FK_publicX_User_AnotherEntity2_Custom",
      columns: ["AnotherEntity2Column_ID"],
      parentEntity: "AnotherEntity2",
    }])
    .getQuery() || "";
  q1 = q1.replaceAll(/[ \n\t]+/ig, " ").trim();
  const qe1 =
    `ALTER TABLE "publicX"."User" DROP CONSTRAINT "FK_publicX_User_AnotherEntity1";
ALTER TABLE "publicX"."User" ADD CONSTRAINT "FK_publicX_User_AnotherEntity1" FOREIGN KEY ("AnotherEntity1Column_ID") REFERENCES "AnotherEntity1" ("AnotherEntity1Column_ID");
ALTER TABLE "publicX"."User" DROP CONSTRAINT "FK_publicX_User_AnotherEntity2";
ALTER TABLE "publicX"."User" ADD CONSTRAINT "FK_publicX_User_AnotherEntity2_Custom" FOREIGN KEY ("AnotherEntity2Column_ID") REFERENCES "AnotherEntity2" ("AnotherEntity2Column_ID")`
      .replace(/[ \n\t]+/ig, " ").trim();
  assertEquals(q1, qe1);
  let q2 = db.alter({ schema: "publicX", entity: "User" })
    .relations({
      columns: ["Column_ID"],
      parentSchema: "anotherSchema",
      parentEntity: "AnotherEntity1",
      parentColumns: ["AnotherEntity1Column_ID"],
    })
    .getQuery() || "";
  q2 = q2.replaceAll(/[ \n\t]+/ig, " ").trim();
  const qe2 =
    `ALTER TABLE "publicX"."User" ADD CONSTRAINT "FK_publicX_User_AnotherEntity1_cdd96d" FOREIGN KEY ("Column_ID") REFERENCES "anotherSchema"."AnotherEntity1" ("AnotherEntity1Column_ID")`
      .replace(/[ \n\t]+/ig, " ").trim();
  assertEquals(q2, qe2);
  const { ForeinghEntity } = await import(
    "./playground/decorators/AlterEntity.ts"
  );
  let q3 = db.alter({ schema: "publicX", entity: "User" })
    .relations({
      columns: ["Column_ID"],
      parentEntity: ForeinghEntity,
    })
    .addRelation({
      columns: ["Column_ID"],
      parentEntity: ForeinghEntity,
      parentColumns: ["ForeinghEntityColumn_ID"],
    })
    .getQuery() || "";
  q3 = q3.replaceAll(/[ \n\t]+/ig, " ").trim();
  const qe3 =
    `ALTER TABLE "publicX"."User" ADD CONSTRAINT "FK_publicX_User_ForeinghEntity_cdd96d" FOREIGN KEY ("Column_ID") REFERENCES "decorator"."ForeinghEntity" ("column21");
ALTER TABLE "publicX"."User" ADD CONSTRAINT "FK_publicX_User_ForeinghEntity_0b7e7d" FOREIGN KEY ("Column_ID") REFERENCES "decorator"."ForeinghEntity" ("ForeinghEntityColumn_ID")`
      .replace(/[ \n\t]+/ig, " ").trim();
  assertEquals(q3, qe3);
  let q4 = db.alter({ entity: "User" })
    .relations(["FK_publicX_User_AnotherEntity1", {
      columns: ["AnotherEntity1Column_ID"],
      parentEntity: "AnotherEntity1",
    }])
    .getQuery() || "";
  q4 = q4.replaceAll(/[ \n\t]+/ig, " ").trim();
  const qe4 =
    `ALTER TABLE "User" DROP CONSTRAINT "FK_publicX_User_AnotherEntity1";
ALTER TABLE "User" ADD CONSTRAINT "FK_publicX_User_AnotherEntity1" FOREIGN KEY ("AnotherEntity1Column_ID") REFERENCES "AnotherEntity1" ("AnotherEntity1Column_ID")`
      .replace(/[ \n\t]+/ig, " ").trim();
  assertEquals(q4, qe4);
});
