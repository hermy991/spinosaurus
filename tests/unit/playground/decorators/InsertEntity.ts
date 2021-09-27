import { _NOW, Column, Entity, InsertColumn, ManyToOne, PrimaryGeneratedColumn } from "spinosaurus/mod.ts";

/**
 * Entity Names
 */
@Entity({ name: "InsertEntity1" })
export class InsertEntity1 {
  @PrimaryGeneratedColumn({ name: "primaryColumn_ID" })
  column1!: number;
  @Column()
  column2!: string;
  @Column()
  column3!: string;
}

@Entity()
export class InsertEntity2 {
  @PrimaryGeneratedColumn()
  column1!: number;
  @Column()
  column2!: string;
  @Column()
  column3!: string;
}

@Entity({ name: "InsertEntity3" })
export class InsertEntity4 {
  @PrimaryGeneratedColumn()
  column1!: number;
  @Column()
  column2!: string;
  @Column()
  column3!: string;
  @Column()
  column4!: string;
  @InsertColumn({}, _NOW)
  column5!: Date;
  @InsertColumn({}, Date)
  column6!: Date;
}

@Entity({ schema: "hello" })
export class InsertEntity5 {
  @PrimaryGeneratedColumn()
  column1!: number;
  @Column()
  column2!: string;
  @Column()
  column3!: string;
}

@Entity({ schema: "hello", name: "InsertEntityCustom" })
export class InsertEntity6 {
  @PrimaryGeneratedColumn()
  primaryColumn_ID!: number;

  @ManyToOne()
  insertEntity1!: InsertEntity1;

  @ManyToOne()
  insertEntity2!: InsertEntity2;

  @ManyToOne({}, { name: "columnPrimary_ID" })
  insertEntity4!: InsertEntity4;

  @ManyToOne()
  insertEntityX1!: InsertEntity5;

  @ManyToOne()
  insertEntityX2!: InsertEntity5;
}
