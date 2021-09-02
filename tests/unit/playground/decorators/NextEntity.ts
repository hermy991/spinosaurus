import {
  Column,
  Entity,
  Next,
  PrimaryGeneratedColumn,
} from "spinosaurus/mod.ts";

const data = await Deno.readTextFile("../files/NextEntity.ts");

@Entity({ schema: "decorator" })
@Next(data)
export class NextEntity1 {
  @PrimaryGeneratedColumn()
  column1!: number;

  @Column({ length: 100 })
  column2!: string;
}
