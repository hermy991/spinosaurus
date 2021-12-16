import { _NOW, Column, Entity, InsertColumn, ManyToOne, PrimaryGeneratedColumn } from "spinosaurus/mod.ts";

/**
 * Entity Names
 */
@Entity({ name: "User1", schema: "returning" })
export class ReturningEntity1 {
  @PrimaryGeneratedColumn()
  column1!: number;
  @Column({ length: 100 })
  column2!: string;
  @Column({ length: 100 })
  column3!: string;
}
