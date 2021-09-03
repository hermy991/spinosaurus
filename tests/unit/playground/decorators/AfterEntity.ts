import {
  After,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "spinosaurus/mod.ts";

const data1 =
  `INSERT INTO "decorator"."AfterEntity1" ("column2") VALUES ( 'THIS A TEST' );
INSERT INTO "decorator"."AfterEntity1" ("column2") VALUES ( 'THIS A ANOTHER TEST' );`;
const data2 =
  `INSERT INTO "decorator"."AfterEntity2" ("column2") VALUES ( 'THIS A TEST' );
INSERT INTO "decorator"."AfterEntity2" ("column2") VALUES ( 'THIS A ANOTHER TEST' );`;

@Entity({ schema: "decorator" })
@After(data1)
export class AfterEntity1 {
  @PrimaryGeneratedColumn()
  column1!: number;

  @Column({ length: 100 })
  column2!: string;
}

@Entity({ schema: "decorator" })
@After(data2)
export class AfterEntity2 {
  @PrimaryGeneratedColumn()
  column1!: number;

  @Column({ length: 100 })
  column2!: string;
}
