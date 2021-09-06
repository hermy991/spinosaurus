# Getting Started

What is Spinosaurus?

This topic can help you understand Spinosaurus: what Spinosaurus is, what
advantages it provides, and what you might expect as you start to build your
applications.

Spinosaurus is a ORM that can run in deno platforms and can be use with
TypeScript. Its goal is to always support the latest TypeScript features and
provide additional features that help you to develop any kind of application
that uses databases - from small applications with a few tables to large scale
enterprise applications with multiple databases. (Spinosaurus is inspired by
typeORM)

## Models

Your models look like this:

```typescript
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "https://deno.land/x/spinosaurus/mod.ts";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  primaryGeneratedColumn!: number;

  @Column()
  column2!: string;

  @Column()
  column3!: string;
}
```

Models could be complicated

```typescript
import {
  Check,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateColumn,
  VersionColumn,
} from "https://deno.land/x/spinosaurus/mod.ts";

@Entity({ schema: "schema", name: "EntityCustom" })
@Unique({ columns: ["column2", "column3"] })
@Check({ expression: `LENGTH("column2") > 0` })
export class Entity {
  @PrimaryGeneratedColumn()
  primaryGeneratedColumn!: number;

  @Column()
  column2!: string;

  @Column({ name: "columnCustom" })
  column3!: string;

  @VersionColumn()
  versionColumn!: number;

  @UpdateColumn({ uniqueOne: true }, _NOW)
  updateColumn?: Date;

  @ManyToOne({})
  anotherEntity: AnotherEntity;
}
```

And your query builder logic looks like this:

```typescript
import { Connection } from "https://deno.land/x/spinosaurus/mod.ts";
import { Entity } from "./Entity.ts"
...
const conn = new Connection(connOpts);
/* Get Data */
const data = await conn.select().from(Entity).getMany();
/* Insert Data */
await conn.insert(Entity)
    .values({ column2: "xx", column3: "xxx" })
    .execute();
/* Update Data */
await conn.update(Entity)
    .set({ primaryGeneratedColumn: 1, column2: "xx", column3: "xxx" })
    .execute();
... 
// etc
```
