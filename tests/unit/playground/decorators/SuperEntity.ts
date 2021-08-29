import { Column } from "spinosaurus/mod.ts";

/**
 * Entity Names
 */
export class SuperEntity1 {
  @Column()
  superColumn1!: string;
  @Column()
  superColumn2!: string;
  @Column()
  superColumn3!: string;
}
