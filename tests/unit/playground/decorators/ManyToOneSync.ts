import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "spinosaurus/mod.ts";

@Entity({ schema: "decorator" })
export class ManyToOneSync1 {
  @PrimaryGeneratedColumn()
  column11!: number;

  @Column({ length: 100 })
  column12?: string;
}

@Entity({ schema: "decorator", name: "ManyToOneSync3" })
export class ManyToOneSync3 {
  @PrimaryGeneratedColumn()
  column31!: number;

  @Column({ length: 100 })
  column32?: string;
}

@Entity({ schema: "decorator" })
export class ManyToOneSync4 {
  @PrimaryGeneratedColumn()
  column1!: number;

  @Column({ length: 100 })
  column2!: string;

  // Adding a new relation
  @ManyToOne({})
  manyToOneSync1!: ManyToOneSync1;

  // Modifying relation
  @ManyToOne({}, { name: "column11" })
  manyToOneSync2!: ManyToOneSync3;

  // Dropping a relation
  // @ManyToOne({})
  // manyToOneSync3!: ManyToOneSync3;
}
