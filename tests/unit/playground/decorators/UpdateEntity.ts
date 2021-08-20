import {
  _NOW,
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateColumn,
  VersionColumn,
} from "spinosaurus/mod.ts";

/**
 * Entity Names
 */
@Entity({ schema: "schema", name: "UpdateEntityCustom" })
export class UpdateEntity1 {
  @PrimaryColumn()
  primaryColumn!: string;

  @Column()
  column2!: string;

  @Column({ name: "columnCustom" })
  column3!: string;

  @VersionColumn()
  versionColumn!: number;

  @UpdateColumn({}, _NOW)
  updateColumn?: Date;
}

@Entity({ schema: "schema" })
export class UpdateEntity2 {
  @PrimaryGeneratedColumn()
  primaryGeneratedColumn?: string;

  @Column()
  column2?: string;

  @Column({ name: "columnCustom" })
  column3?: string;

  @VersionColumn()
  versionColumn!: number;

  @UpdateColumn({}, _NOW)
  updateColumn?: Date;
}
