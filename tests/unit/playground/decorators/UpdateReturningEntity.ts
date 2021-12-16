import { _NOW, Column, Entity, PrimaryGeneratedColumn } from "spinosaurus/mod.ts";

/**
 * Entity Names
 */
@Entity({ name: "User1", schema: "returning" })
export class UpdateReturningEntity1 {
  @PrimaryGeneratedColumn()
  column1!: number;
  @Column({ length: 100 })
  column2!: string;
  @Column({ length: 100 })
  column3!: string;
}
