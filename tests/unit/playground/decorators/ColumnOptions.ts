import { Column, Entity } from "spinosaurus/mod.ts";

/**
 * Column Types Test
 */
@Entity({ name: "ColumnOptions1" })
export class ColumnOptions1 {
  @Column({ spitype: "varchar", length: 100 })
  varchar1 = "";
  @Column({ spitype: "text", length: 100 }) // changes to varchar
  text1 = "";
  @Column({ spitype: "numeric", precision: 15, scale: 4 })
  numeric1 = 0;
  @Column({ spitype: "numeric", precision: 15 })
  numeric2 = 0;
  @Column({ spitype: "numeric", length: 8 }) // changes to bigint
  numeric3 = 0;
  @Column({ spitype: "numeric", length: 4 }) // changes to integer
  numeric4 = 0;
  @Column({ spitype: "numeric", length: 2 }) // changes to smallint
  numeric5 = 0;
  @Column({ spitype: "integer" })
  integer1 = 0;
  @Column({ spitype: "smallint" })
  integer2 = 0;
  @Column({ spitype: "boolean" })
  boolean2 = false;
  @Column({ spitype: "bigint" })
  bigint1 = BigInt("0");
}
