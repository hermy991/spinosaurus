import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "spinosaurus/mod.ts";

@Entity({ schema: "logging" })
@Unique({ columns: ["column2"] })
@Unique({ columns: ["column2", "column3"] })
@Unique({ columns: ["column2", "column3", "column4"] })
@Unique({ columns: ["column4", "column5"] })
@Unique({ name: "UQ_LoggingEntity1_1", columns: ["column2"] })
@Unique({ name: "UQ_LoggingEntity1_2", columns: ["column2", "column3"] })
@Unique({ name: "UQ_LoggingEntity1_3", columns: ["column2", "column3", "column4"] })
@Unique({ name: "UQ_LoggingEntity1_4", columns: ["column4", "column5"] })
export class LoggingEntity1 {
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

@Entity({ schema: "logging" })
@Unique({ columns: ["another1", "column3"] })
@Unique({ columns: ["another2", "another3"] })
export class LoggingEntity2 {
  @PrimaryGeneratedColumn()
  column1!: number;

  @ManyToOne({})
  another1!: LoggingEntity1;

  @Column()
  column3!: string;

  @ManyToOne({}, { name: "xx" })
  another2!: LoggingEntity1;

  @ManyToOne({})
  another3!: LoggingEntity1;
}
