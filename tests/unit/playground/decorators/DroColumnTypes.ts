import { Column, Entity } from "spinosaurus/mod.ts";

/**
 * Column Types Test
 */
@Entity({ name: "DroColumnTypes1", schema: "decorator" })
export class DroColumnTypes1 {
  @Column()
  string1 = "";
}
