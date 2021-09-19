import { _NOW, Column, Entity, InsertColumn, PrimaryGeneratedColumn } from "spinosaurus/mod.ts";

/**
 * Entity Names
 */
@Entity({ name: "InsertEntity1" })
export class InsertEntity1 {
  @PrimaryGeneratedColumn()
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
