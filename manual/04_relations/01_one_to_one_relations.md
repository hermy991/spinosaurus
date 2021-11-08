# One-to-one relations

One-to-one is a relation where A contains only one instance of B, and B contains only one instance of A. Let's take for
example `User` and `Profile` entities. User can have only a single profile, and a single profile is owned by only a
single user.

```typescript
import { Column, Entity, PrimaryGeneratedColumn } from "https://deno.land/x/spinosaurus/mod.ts";

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gender: string;

  @Column()
  photo: string;
}
```

```typescript
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "https://deno.land/x/spinosaurus/mod.ts";
import { Profile } from "./Profile.ts";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToOne({})
  profile: Profile;
}
```

Here we added `@OneToOne` to the `profile` and specify the target relation type to be `Profile`.

This example will produce following tables:

```shell
+-------------+--------------+----------------------------+
|                        profile                          |
+-------------+--------------+----------------------------+
| id          | int(11)      | PRIMARY KEY AUTO_INCREMENT |
| gender      | varchar(255) |                            |
| photo       | varchar(255) |                            |
+-------------+--------------+----------------------------+

+-------------+--------------+----------------------------+
|                          user                           |
+-------------+--------------+----------------------------+
| id          | int(11)      | PRIMARY KEY AUTO_INCREMENT |
| name        | varchar(255) |                            |
| profileId   | int(11)      | FOREIGN KEY                |
+-------------+--------------+----------------------------+
```

Example how to save such a relation:

```typescript
const profile = new Profile();
profile.gender = "male";
profile.photo = "me.jpg";
await conn.update(Profile).set(profile).execute();

const user = new User();
user.name = "Joe Smith";
user.profile = profile;
await conn.update(User).set(user).execute();
```

There is no automatic condition in query selector

```typescript
const users = await connection.from(User, "user")
  .leftAndSelect("user.profile", "profile", `"profile"."id" = "user"."id"`)
  .getMany();
```
