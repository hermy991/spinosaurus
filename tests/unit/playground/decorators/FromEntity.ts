import { Column, Entity } from "spinosaurus/mod.ts";

/**
 * Entity Names
 */
@Entity({ name: "FromEntity1" })
export class FromEntity1 {
  @Column()
  test1!: string;
  test2!: string;
  test3!: string;
}

@Entity()
export class FromEntity2 {
  @Column()
  test1!: string;
  test2!: string;
  test3!: string;
}

@Entity({ name: "FromEntity3" })
export class FromEntity4 {
  @Column()
  test1!: string;
  test2!: string;
  test3!: string;
}

@Entity({ schema: "hello" })
export class FromEntity5 {
  @Column()
  test1!: string;
  test2!: string;
  test3!: string;
}
