import { Column, Data, Entity, PrimaryGeneratedColumn } from "spinosaurus/mod.ts";

@Entity({ schema: "decorator" })
@Data({ column2: "hola como estas" })
export class DataEntity1 {
  @PrimaryGeneratedColumn()
  column1!: number;

  @Column({ length: 100 })
  column2!: string;
}
