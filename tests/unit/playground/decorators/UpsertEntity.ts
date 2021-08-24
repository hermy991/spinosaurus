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
@Entity({ schema: "schema", name: "UpsertEntityCustom" })
export class UpsertEntity1 {
  @PrimaryGeneratedColumn()
  primaryGeneratedColumn!: number;

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
export class UpsertEntity2 {
  @PrimaryGeneratedColumn()
  primaryGeneratedColumn?: number;

  @Column()
  column2?: string;

  @Column({ name: "columnCustom" })
  column3?: string;

  @VersionColumn()
  versionColumn!: number;

  @UpdateColumn({}, _NOW)
  updateColumn?: Date;
}
