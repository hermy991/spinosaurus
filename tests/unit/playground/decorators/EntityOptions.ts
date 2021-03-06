import { Column, Entity } from "spinosaurus/mod.ts";

/**
 * Entity Names
 */
@Entity({ name: "EntityOptions1" })
export class EntityOptions1 {
  @Column()
  test1!: string;
  test2!: string;
  test3!: string;
}

@Entity()
export class EntityOptions2 {
  @Column()
  test1!: string;
  test2!: string;
  test3!: string;
}

@Entity({ name: "EntityOptions3" })
export class EntityOptions4 {
  @Column()
  test1!: string;
  test2!: string;
  test3!: string;
}

@Entity({ schema: "hello" })
export class EntityOptions5 {
  @Column()
  test1!: string;
  test2!: string;
  test3!: string;
}
