import { _NOW, Column, Entity } from "spinosaurus/mod.ts";

/**
 * Column Types Test
 */
@Entity({ name: "ModColumnTypes1", schema: "decorator" })
export class ModColumnTypes1 {
  @Column()
  string1 = "";

  @Column()
  string2!: string;

  @Column()
  string3?: string = "";

  @Column()
  number1 = 100;

  @Column()
  number2!: number;

  @Column()
  number3: number = 100;

  @Column()
  bigint1 = BigInt(100);

  @Column()
  bigint2!: bigint;

  @Column()
  bigint3: bigint = BigInt(100);

  @Column()
  boolean1 = true;

  @Column()
  boolean2!: boolean;

  @Column()
  boolean3: boolean = true;

  @Column()
  timestamp1 = _NOW;

  @Column()
  timestamp2!: Date;

  @Column()
  timestamp3: Date = <any> Date;

  @Column()
  arraybuffer1 = new ArrayBuffer(8);

  @Column()
  arraybuffer2!: ArrayBuffer;

  @Column()
  arraybuffer3: ArrayBuffer = new ArrayBuffer(8);

  @Column()
  blob1 = new Blob();

  @Column()
  blob2!: Blob;

  @Column()
  blob3: Blob = new Blob();
}
