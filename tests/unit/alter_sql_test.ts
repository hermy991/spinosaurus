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
  const q1 = db.alter({ schema: "publicX", entity: "User" })
    .relations([["FK_publicX_User_AnotherEntity1", {
      columns: ["AnotherEntity1Column_ID"],
      parentEntity: "AnotherEntity1",
    }]])
    .addRelation(["FK_publicX_User_AnotherEntity2", {
      name: "FK_publicX_User_AnotherEntity2_Custom",
      columns: ["AnotherEntity2Column_ID"],
      parentEntity: "AnotherEntity2",
    }])
    .getSqls().join(";\n");
  const qe1 =
    `ALTER TABLE "publicX"."User" DROP CONSTRAINT "FK_publicX_User_AnotherEntity1";
ALTER TABLE "publicX"."User" ADD CONSTRAINT "FK_publicX_User_AnotherEntity1" FOREIGN KEY ("AnotherEntity1Column_ID") REFERENCES "AnotherEntity1" ("AnotherEntity1Column_ID");
ALTER TABLE "publicX"."User" DROP CONSTRAINT "FK_publicX_User_AnotherEntity2";
ALTER TABLE "publicX"."User" ADD CONSTRAINT "FK_publicX_User_AnotherEntity2_Custom" FOREIGN KEY ("AnotherEntity2Column_ID") REFERENCES "AnotherEntity2" ("AnotherEntity2Column_ID")`;
  assertEquals(q1, qe1);
  const q2 = db.alter({ schema: "publicX", entity: "User" })
    .relations([{
      columns: ["Column_ID"],
      parentSchema: "anotherSchema",
      parentEntity: "AnotherEntity1",
      parentColumns: ["AnotherEntity1Column_ID"],
    }])
    .getSqls().join(";\n");
  const qe2 =
    `ALTER TABLE "publicX"."User" ADD CONSTRAINT "FK_publicX_User_AnotherEntity1_cdd96d" FOREIGN KEY ("Column_ID") REFERENCES "anotherSchema"."AnotherEntity1" ("AnotherEntity1Column_ID")`;
  assertEquals(q2, qe2);
  const { ForeinghEntity } = await import(
    "./playground/decorators/AlterEntity.ts"
  );
  const q3 = db.alter({ schema: "publicX", entity: "User" })
    .relations([{
      columns: ["Column_ID"],
      parentEntity: ForeinghEntity,
    }])
    .addRelation({
      columns: ["Column_ID"],
      parentEntity: ForeinghEntity,
      parentColumns: ["ForeinghEntityColumn_ID"],
    })
    .getSqls().join(";\n");
  const qe3 =
    `ALTER TABLE "publicX"."User" ADD CONSTRAINT "FK_publicX_User_ForeinghEntity_cdd96d" FOREIGN KEY ("Column_ID") REFERENCES "decorator"."ForeinghEntity" ("column21");
ALTER TABLE "publicX"."User" ADD CONSTRAINT "FK_publicX_User_ForeinghEntity_0b7e7d" FOREIGN KEY ("Column_ID") REFERENCES "decorator"."ForeinghEntity" ("ForeinghEntityColumn_ID")`;
  assertEquals(q3, qe3);
  const q4 = db.alter({ entity: "User" })
    .relations([["FK_publicX_User_AnotherEntity1", {
      columns: ["AnotherEntity1Column_ID"],
      parentEntity: "AnotherEntity1",
    }]])
    .getSqls().join(";\n");
  const qe4 =
    `ALTER TABLE "User" DROP CONSTRAINT "FK_publicX_User_AnotherEntity1";
ALTER TABLE "User" ADD CONSTRAINT "FK_publicX_User_AnotherEntity1" FOREIGN KEY ("AnotherEntity1Column_ID") REFERENCES "AnotherEntity1" ("AnotherEntity1Column_ID")`;
  assertEquals(q4, qe4);
});
