import {
  _NOW,
  Column,
  Entity,
  InsertColumn,
  ManyToOne,
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

@Entity({ name: "UpdateEntity3" })
export class UpdateEntity4 {
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
export class UpdateEntity5 {
  @PrimaryGeneratedColumn()
  column1!: number;
  @Column()
  column2!: string;
  @Column()
  column3!: string;
}

@Entity({ schema: "hello", name: "UpdateEntityCustom" })
export class UpdateEntity6 {
  @PrimaryGeneratedColumn()
  primaryColumn_ID!: number;

  @ManyToOne()
  insertEntity1!: UpdateEntity1;

  @ManyToOne()
  insertEntity2!: UpdateEntity2;

  @ManyToOne({}, { name: "columnPrimary_ID" })
  insertEntity4!: UpdateEntity4;

  @ManyToOne()
  insertEntityX1!: UpdateEntity5;

  @ManyToOne()
  insertEntityX2!: UpdateEntity5;
}
