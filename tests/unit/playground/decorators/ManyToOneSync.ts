import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "spinosaurus/mod.ts";

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

  // No hace nada
  @ManyToOne({})
  manyToOneSync1!: ManyToOneSync1;

  // Dropping a relation
  // @ManyToOne({})
  // manyToOneSync3!: ManyToOneSync3;

  // Adding a column relation
  @ManyToOne({ name: "FK_MyNewContranint" }, {})
  manyToOneSync3!: ManyToOneSync3;

  // Modify a reference column
  @ManyToOne({ name: "FK_ContraintToModify" }, { name: "columnReference_ID" })
  manyToOneSyncX!: ManyToOneSync1;
}
