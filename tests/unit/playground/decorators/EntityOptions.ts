import {Entity, Column} from "spinosaurus/mod.ts"

/**
 * Entity Names
 */
@Entity({name: "EntityOptions1"})
export class EntityOptions1 {
  test1?: string;
  test2?: string;
  test3?: string;
}

@Entity()
export class EntityOptions2 {
  test1?: string;
  test2?: string;
  test3?: string;
}

@Entity({name: "EntityOptions3"})
export class EntityOptions4 {
  test1?: string;
  test2?: string;
  test3?: string;
}
