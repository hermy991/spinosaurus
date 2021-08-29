import {
  _NOW,
  Column,
  Entity,
  InsertColumn,
  PrimaryGeneratedColumn,
} from "spinosaurus/mod.ts";

/**
 * Entity Names
 */
@Entity({ name: "CustomeEntity1" })
export class CreateEntity1 {
  @PrimaryGeneratedColumn()
  column1!: number;
  @Column()
  column2!: string;
  @Column()
  column3!: string;
}
