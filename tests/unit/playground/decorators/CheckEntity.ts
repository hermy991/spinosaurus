import {
  Check,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "spinosaurus/mod.ts";

@Entity({ schema: "decorator" })
@Check({ expression: `LENGTH("column2") > 0` })
@Check({
  name: `CHK_CheckEntity1_column2_2`,
  expression: `LENGTH("column2") > 0`,
})
export class CheckEntity1 {
  @PrimaryGeneratedColumn()
  column1!: number;

  @Column({ length: 100 })
  column2!: string;
}
