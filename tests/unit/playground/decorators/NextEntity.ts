import {
  Column,
  Entity,
  Next,
  PrimaryGeneratedColumn,
} from "spinosaurus/mod.ts";

const data =
  `INSERT INTO "decorator"."NextEntity1" ("column2") VALUES ( 'THIS A TEST' );
INSERT INTO "decorator"."NextEntity1" ("column2") VALUES ( 'THIS A ANOTHER TEST' );`;

@Entity({ schema: "decorator" })
@Next(data)
export class NextEntity1 {
  @PrimaryGeneratedColumn()
  column1!: number;

  @Column({ length: 100 })
  column2!: string;
}
