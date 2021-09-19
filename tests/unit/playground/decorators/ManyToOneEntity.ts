import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "spinosaurus/mod.ts";

@Entity({ schema: "decorator" })
export class ManyToOneEntity1 {
  @PrimaryGeneratedColumn()
  column21!: number;

  @Column({ length: 100 })
  column22!: string;
}

@Entity({ schema: "decorator" })
export class ManyToOneEntity3 {
  @PrimaryGeneratedColumn()
  column11!: number;

  @Column({ length: 100 })
  column12!: string;
}

@Entity({ schema: "decorator" })
export class ManyToOneEntity2 {
  @PrimaryGeneratedColumn()
  column1!: number;

  @Column({ length: 100 })
  column2!: string;

  @ManyToOne({})
  entity3!: ManyToOneEntity3;

  @ManyToOne({}, { nullable: true })
  entity4!: ManyToOneEntity3;

  @ManyToOne({}, { name: "column11" })
  entity5!: ManyToOneEntity3;

  @ManyToOne({ name: "FK_ManyToOneEntity2_primary_ID" })
  entity6!: ManyToOneEntity3;

  @ManyToOne({ entity: ManyToOneEntity1 })
  entity7!: ManyToOneEntity3;
}
