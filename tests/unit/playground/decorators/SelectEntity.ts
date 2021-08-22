import { Column, Entity, PrimaryColumn } from "spinosaurus/mod.ts";

/**
 * Entity Names
 */
@Entity({ name: "SelectEntityCustom" })
export class SelectEntity1 {
  @PrimaryColumn()
  test1!: string;
  @Column()
  test2!: string;
  @Column({ name: "custom" })
  test3!: string;
}

@Entity()
export class SelectEntity2 {
  @PrimaryColumn()
  test1!: string;
  @Column()
  test2!: string;
  @Column()
  test3!: string;
}

@Entity({ name: "SelectEntity3" })
export class SelectEntity4 {
  @PrimaryColumn()
  test1!: string;
  @Column()
  test2!: string;
  @Column()
  test3!: string;
}

@Entity({ schema: "hello" })
export class SelectEntity5 {
  @PrimaryColumn()
  test1!: string;
  @Column()
  test2!: string;
  @Column({ select: false })
  test3!: string;
}
