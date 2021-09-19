import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "spinosaurus/mod.ts";

@Entity({ schema: "decorator" })
export class OneToOneEntity1 {
  @PrimaryGeneratedColumn()
  column21!: number;

  @Column({ length: 100 })
  column22!: string;
}

@Entity({ schema: "decorator" })
export class OneToOneEntity3 {
  @PrimaryGeneratedColumn()
  column11!: number;

  @Column({ length: 100 })
  column12!: string;
}

@Entity({ schema: "decorator" })
export class OneToOneEntity2 {
  @PrimaryGeneratedColumn()
  column1!: number;

  @Column({ length: 100 })
  column2!: string;

  @OneToOne({})
  entity3!: OneToOneEntity3;

  @OneToOne({}, { nullable: true })
  entity4?: OneToOneEntity3;

  @OneToOne({}, { name: "column11" })
  entity5!: OneToOneEntity3;

  @OneToOne({ name: "FK_OneToOneEntity2_primary_ID" })
  entity6!: OneToOneEntity3;

  @OneToOne({ entity: OneToOneEntity1 })
  entity7!: OneToOneEntity3;

  @ManyToOne({ entity: OneToOneEntity1 }, { uniqueOne: true })
  entity8!: OneToOneEntity3;
}
