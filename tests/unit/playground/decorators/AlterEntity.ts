import { Column, Entity, PrimaryGeneratedColumn } from "spinosaurus/mod.ts";

@Entity({ schema: "decorator" })
export class ForeinghEntity {
  @PrimaryGeneratedColumn()
  column21?: number;

  @Column({ length: 100 })
  column22?: string;
}
