import {
  _NOW,
  Check,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from "spinosaurus/mod.ts";

/**
 * Entity Names
 */
@Entity({ name: "CustomEntity1" })
export class CreateEntity1 {
  @PrimaryGeneratedColumn()
  column1!: number;
  @Column()
  column2!: string;
  @Column()
  column3!: string;
}

@Entity({ name: "CustomCreateEntity1" })
@Check({ expression: `LENGTH("column2") > 0` })
@Check({
  name: `CHK_CheckEntity1_column2_2`,
  expression: `LENGTH("column2") > 0`,
})
export class CreateEntity2 {
  @PrimaryGeneratedColumn()
  column1!: number;
  @Column()
  column2!: string;
  @Column()
  column3!: string;
}

@Entity({ schema: "decorator" })
@Unique({ columns: ["column2"] })
@Unique({ columns: ["column2", "column3"] })
@Unique({ columns: ["column2", "column3", "column4"] })
@Unique({ columns: ["column4", "column5"] })
@Unique({ name: "UQ_UniqueEntity1_1", columns: ["column2"] })
@Unique({ name: "UQ_UniqueEntity1_2", columns: ["column2", "column3"] })
@Unique({
  name: "UQ_UniqueEntity1_3",
  columns: ["column2", "column3", "column4"],
})
@Unique({ name: "UQ_UniqueEntity1_4", columns: ["column4", "column5"] })
export class UniqueEntity1 {
  @PrimaryGeneratedColumn()
  column1!: number;

  @Column({ length: 100 })
  column2!: string;

  @Column({ length: 100 })
  column3!: string;

  @Column({ name: "custom4", length: 100 })
  column4!: string;

  @Column({ name: "custom5", length: 100 })
  column5!: string;

  @Column({ length: 100, unique: true })
  column6!: string;

  @Column({ length: 100, unique: true })
  column7!: string;

  @Column({ length: 100, uniqueOne: true })
  column8!: string;

  @Column({ name: "custom9", length: 100, unique: true })
  column9!: string;

  @Column({ name: "custom10", length: 100, unique: true })
  column10!: string;

  @Column({ name: "custom11", length: 100, uniqueOne: true })
  column11!: string;
}
