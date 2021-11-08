# Many-to-one relations

Many-to-one is a relation where A contains multiple instances of B, but B contains only one instance of A. Let's take
for example `User` and `Photo` entities. User can have multiple photos, but each photo is owned by only one single user.

```typescript
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "https://deno.land/x/spinosaurus/mod.ts";
import { User } from "./User.ts";

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @ManyToOne({})
  user: User;
}
```

```typescript
import { Column, Entity, PrimaryGeneratedColumn } from "https://deno.land/x/spinosaurus/mod.ts";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
```

Where you set `@ManyToOne` - its related entity will have "relation id" and foreign key.

This example will produce following tables:

```shell
+-------------+--------------+----------------------------+
|                         photo                           |
+-------------+--------------+----------------------------+
| id          | int(11)      | PRIMARY KEY AUTO_INCREMENT |
| url         | varchar(255) |                            |
| userId      | int(11)      | FOREIGN KEY                |
+-------------+--------------+----------------------------+

+-------------+--------------+----------------------------+
|                          user                           |
+-------------+--------------+----------------------------+
| id          | int(11)      | PRIMARY KEY AUTO_INCREMENT |
| name        | varchar(255) |                            |
+-------------+--------------+----------------------------+
```

Example how to save such relation:

```typescript
const user = new User();
user.name = "John";
await conn.update(User).set(user).execute();

const photo1 = new Photo();
photo1.url = "me.jpg";
photo1.user = user;
await conn.update(Photo).set(photo1).execute();

const photo2 = new Photo();
photo2.url = "me-and-bears.jpg";
photo2.user = user;
await conn.update(Photo).set(photo1).execute();
```

There is no automatic condition in query selector

```typescript
const users = await connection.from(User, "user")
  .leftAndSelect("user.photo", "photo", `"photo"."id" = "user"."id"`)
  .getMany();
```
