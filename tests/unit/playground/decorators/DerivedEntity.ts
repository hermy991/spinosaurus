import { Column, Entity, PrimaryGeneratedColumn } from "spinosaurus/mod.ts";
import { SuperEntity1 } from "./SuperEntity.ts";

/**
 * Entity Names
 */
@Entity()
export class DerivedEntity1 extends SuperEntity1 {
  @PrimaryGeneratedColumn()
  derivedColumn1!: number;
  @Column()
  derivedColumn2!: number;
  @Column()
  derivedColumn3!: number;
}

@Entity({ name: "SubEntity2" })
export class DerivedEntity2 extends SuperEntity1 {
  @PrimaryGeneratedColumn()
  derivedColumn7!: number;
  @Column()
  derivedColumn8!: number;
  @Column({ name: "baseColumn3" })
  derivedColumn9!: number;
}
