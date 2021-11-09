# Select using Query Builder

- [What is `QueryBuilder`](#what-is-querybuilder)
- [Important note when using the `QueryBuilder`](#important-note-when-using-the-querybuilder)
- [How to create and use a `QueryBuilder`](#how-to-create-and-use-a-querybuilder)
- [Getting values using QueryBuilder](#getting-values-using-querybuilder)
- [What are aliases for?](#what-are-aliases-for)
- [Using parameters to escape data](#using-parameters-to-escape-data)
- [Adding `WHERE` expression](#adding-where-expression)
- [Adding `HAVING` expression](#adding-having-expression)
- [Adding `ORDER BY` expression](#adding-order-by-expression)
- [Adding `GROUP BY` expression](#adding-group-by-expression)
- [Adding `LIMIT` expression](#adding-limit-expression)
- [Adding `OFFSET` expression](#adding-offset-expression)
- [Joining relations](#joining-relations)
- [Inner and left joins](#inner-and-left-joins)
- [Join without selection](#join-without-selection)
- [Joining any entity or table](#joining-any-entity-or-table)
- [Joining and mapping functionality](#joining-and-mapping-functionality)
- [Getting the generated query](#getting-the-generated-query)
- [Getting raw results](#getting-raw-results)
- [Using pagination](#using-pagination)
- [Max execution time](#max-execution-time)
- [Hidden Columns](#hidden-columns)

## What is `QueryBuilder`

`QueryBuilder` is one of the most powerful features of Spinosaurus - it allows you to build SQL queries using elegant
and convenient syntax, execute them and get automatically transformed entities.

Simple example of `QueryBuilder`:

```typescript
const firstUser = await conn
  .select()
  .from(User, "u")
  .where(`"u"."id" = :id`, { id: 1 })
  .getOne();
```

It builds the following SQL query:

```sql
SELECT "u"."id" as "Id",
    "u"."firstName" as "FirstName",
    "u"."lastName" as "LastName"
FROM users "u"
WHERE "u"."id" = 1
```

and returns you an instance of `Object`:

```
{
  Id: 1,
  FirstName: "Timber",
  LastName: "Saw"
}
```

## Important note when using the `QueryBuilder`

When using the `QueryBuilder`, you need to provide unique parameters in your `WHERE` expressions. **This will not
work**:

```TypeScript
const result = await conn
  .from(User, "u")
  .joinAndSelect(Person, `"person"."id" = "u"."personID"`)
  .where(`"u"."id" = :id`, { id: userId })
  .andWhere(`"person"."id" = :id`, { id: personId })
  .getOne();
```

... but this will:

```TypeScript
const result = await conn
  .from(User, "u")
  .joinAndSelect(Person, `"person"."id" = "u"."personID"`)
  .where(`"u"."id" = :userId`, { userId })
  .andWhere(`"person"."id" = :personId`, { personId })
  .getOne();
```

Note that we uniquely named `:sheepId` and `:cowId` instead of using `:id` twice for different parameters.

## How to create and use a `QueryBuilder`

There are several ways how you can create a `Query Builder`:

- Using connection:

```typescript
import {Connection, getConnection} from `https://deno.land/x/spinosaurus/mod.ts`;

Connection conn = getConnection();
const user = await conn.from(User, "u")
    .joinAndSelect({entity: Person, on: `"person"."id" = "u"."personID"`})
    .where(`"u"."id" = :userId`, { userId })
    .andWhere(`"person"."id" = :personId`, { personId })
    .getOne();
```

There are 5 different `QueryBuilder` types available:

- `SelectQueryBuilder` - used to build and execute `SELECT` queries. Example:

```typescript
import {getConnection} from `https://deno.land/x/spinosaurus/mod.ts`;

const user = await getConnection().from(User, "u")
    .joinAndSelect({entity: Person, on: `"person"."id" = "u"."personID"`})
    .where(`"u"."id" = :userId`, { userId })
    .andWhere(`"person"."id" = :personId`, { personId })
    .getOne();
```

- `InsertQueryBuilder` - used to build and execute `INSERT` queries. Example:

```typescript
import { getConnection } from "typeorm";

await getConnection().insert(User).values([{
  firstName: "Timber",
  lastName: "Saw",
}, { firstName: "Phantom", lastName: "Lancer" }]).execute();
```

- `UpdateQueryBuilder` - used to build and execute `UPDATE` queries. Example:

```typescript
import { getConnection } from "typeorm";

await getConnection()
  .update(User)
  .set({ firstName: "Timber", lastName: "Saw" })
  .where("id = :id", { id: 1 })
  .execute();
```

- `DeleteQueryBuilder` - used to build and execute `DELETE` queries. Example:

```typescript
import { getConnection } from "typeorm";

await getConnection()
  .delete(User)
  .where("id = :id", { id: 1 })
  .execute();
```

- `RelationQueryBuilder` - used to build and execute relation-specific operations [TBD].

You can switch between different types of query builder within any of them, once you do, you will get a new instance of
query builder (unlike all other methods).

## Getting values using `QueryBuilder`

To get a single result from the database, for example to get a user by id or name, you must use `getOne`:

```typescript
import {getConnection} from `https://deno.land/x/spinosaurus/mod.ts`;

const user = await getConnection().from(User, "u")
    .joinAndSelect(Person, `"person"."id" = "u"."personID"`)
    .where(`"u"."id" = :id OR "u"."name" = :name`, { id: 1, name: "Timber" })
    .getOne();
```

To get multiple results from the database, for example, to get all users from the database, use `getMany`:

```typescript
import {getConnection} from `https://deno.land/x/spinosaurus/mod.ts`;

const users = await getConnection().from(User).getMany();
```

There are two types of results you can get using select query builder: **entities** or **raw results**. Most of the
time, you need to select real entities from your database, for example, users. For this purpose, you use `getOne` and
`getMany`. But sometimes you need to select some specific data, let's say the _sum of all user photos_. This data is not
an entity, it's called raw data. To get raw data, you use `getOne` and `getMany` and modify with `select()` function.
Examples:

```typescript
import {getConnection} from `https://deno.land/x/spinosaurus/mod.ts`;

const { sum } = await getConnection()
    .select(["SUM(user.photosCount)", "sum"])
    .from(User)
    .where(`"users"."id" = :id`, { id: 1 })
    .getOne();
```

```typescript
import {getConnection} from `https://deno.land/x/spinosaurus/mod.ts`;

const photosSums = await getConnection()
    .select([`"photos"."id"`, "Id"])
    .addSelect(`SUM("photos"."price")`, "Sum")
    .from({ entity: Photo })
    .groupBy(`"photos"."id"`)
    .getMany();

// [{ Id: 1, Sum: 25 }, { Id: 2, Sum: 13 }, ...]
```

## What are aliases for?

We used `from({ entity: User, as: "user"})`. But what is "user"? It's just a regular SQL alias. We use aliases
everywhere, except when we work with selected data.

```typescript
await getConnection()
  .select()
  .from({ entity: User, as: "user" });
```

Which will result in the following sql query:

```sql
SELECT "user"."id",
    "user"."FirstName",
    "user"."SurName"
FROM "users" as "user"
```

In this SQL query, `users` is the table name, and `user` is an alias we assign to this table. Later we use this alias to
access the table:

```typescript
await getConnection().from(User, "user")
  .where("user.name = :name", { name: "Timber" });
```

Which produces the following SQL query:

```sql
SELECT "user"."id",
    "user"."FirstName",
    "user"."SurName"
FROM "users" as "user"
WHERE user.name = 'Timber'
```

See, we used the users table by using the `user` alias we assigned when we created a query builder.

One query builder is not limited to one alias, they can have multiple aliases. Each select can have its own alias, you
can select from multiple tables each with its own alias, you can join multiple tables each with its own alias. You can
use those aliases to access tables are you selecting (or data you are selecting).

## Using parameters to escape data

We used ``where(`"user"."name" = :name`, { name: "Timber" })``. What does `{ name: "Timber" }` stand for? It's a
parameter we used to prevent SQL injection. We could have written: ``where(`"user"."name" = '${name}'`)``, however this
is not safe, as it opens the code to SQL injections. The safe way is to use this special syntax:
``where(`"user"."name" = :name`, { name: "Timber" })``, where `:name` is a parameter name and the value is specified in
an object: `{ name: "Timber" }`.

```typescript
.where(`"user"."name" = :name`, { name: "Timber" })
```

is a shortcut for:

```typescript
.where(`"user"."name" = :name`)
.parameter("name", "Timber")
```

Note: do not use the same parameter name for different values across the query builder. Values will be overridden if you
set them multiple times.

You can also supply an array of values, and have them transformed into a list of values in the SQL statement, by using
the special expansion syntax:

```typescript
.where("user.name IN (:names)", { names: [ "Timber", "Cristal", "Lina" ] })
```

Which becomes:

```sql
WHERE user.name IN ('Timber', 'Cristal', 'Lina')
```

## Adding `WHERE` expression

Adding a `WHERE` expression is as easy as:

```typescript
select()
  .from(User, "user")
  .where("user.name = :name", { name: "Timber" });
```

Which will produce:

```sql
SELECT ... FROM users "user" WHERE user.name = 'Timber'
```

You can add `AND` into an existing `WHERE` expression:

```typescript
select()
  .from(User, "user")
  .where("user.firstName = :firstName", { firstName: "Timber" })
  .andWhere("user.lastName = :lastName", { lastName: "Saw" });
```

Which will produce the following SQL query:

```sql
SELECT ... 
FROM users as "user" 
WHERE user.firstName = 'Timber'
AND user.lastName = 'Saw'
```

You can add `OR` into an existing `WHERE` expression:

```typescript
select()
  .from(User, "user")
  .where("user.firstName = :firstName", { firstName: "Timber" })
  .orWhere("user.lastName = :lastName", { lastName: "Saw" });
```

Which will produce the following SQL query:

```sql
SELECT ... 
FROM users "user" 
WHERE user.firstName = 'Timber' 
OR user.lastName = 'Saw'
```

You can do an `IN` query with the `WHERE` expression:

```typescript
select()
  .from(User, "user")
  .where("user.id IN (:ids)", { ids: [1, 2, 3, 4] });
```

Which will produce the following SQL query:

```sql
SELECT ... 
FROM users "user"
WHERE user.id IN (1, 2, 3, 4)
```

You can combine as many `AND` and `OR` expressions as you need. If you use `.where` more than once you'll override all
previous `WHERE` expressions.

Note: be careful with `orWhere` - if you use complex expressions with both `AND` and `OR` expressions, keep in mind that
they are stacked without any pretences. Sometimes you'll need to create a where string instead, and avoid using
`orWhere`.

## Adding `HAVING` expression

Adding a `HAVING` expression is easy as:

```typescript
select()
  .from(User, "user")
  .having("user.name = :name", { name: "Timber" });
```

Which will produce following SQL query:

```sql
SELECT ... 
FROM users as "user" 
HAVING user.name = 'Timber'
```

You can add `AND` into an exist `HAVING` expression:

```typescript
select()
  .from(User, "user")
  .having("user.firstName = :firstName", { firstName: "Timber" })
  .andHaving("user.lastName = :lastName", { lastName: "Saw" });
```

Which will produce the following SQL query:

```sql
SELECT ... 
FROM users as "user"
HAVING user.firstName = 'Timber' 
AND user.lastName = 'Saw'
```

You can add `OR` into a exist `HAVING` expression:

```typescript
select()
  .from(User, "user")
  .having("user.firstName = :firstName", { firstName: "Timber" })
  .orHaving("user.lastName = :lastName", { lastName: "Saw" });
```

Which will produce the following SQL query:

```sql
SELECT ... 
FROM users as "user"
HAVING user.firstName = 'Timber' 
OR user.lastName = 'Saw'
```

You can combine as many `AND` and `OR` expressions as you need. If you use `.having` more than once you'll override all
previous `HAVING` expressions.

## Adding `ORDER BY` expression

Adding an `ORDER BY` expression is easy as:

```typescript
select()
  .from(User, "user")
  .orderBy("user.id");
```

Which will produce:

```sql
SELECT ...
FROM users as "user"
ORDER BY user.id
```

You can change the ordering direction from ascending to descending (or versa):

```typescript
select()
  .from(User, "user")
  .orderBy("user.id", "DESC");

select()
  .from(User, "user")
  .orderBy("user.id", "ASC");
```

You can add multiple order-by criteria:

```typescript
select()
  .from(User, "user")
  .orderBy("user.name")
  .addOrderBy("user.id");
```

You can also use a map of order-by fields:

```typescript
select()
  .from(User, "user")
  .orderBy({
    "user.name": "ASC",
    "user.id": "DESC",
  });
```

If you use `.orderBy` more than once you'll override all previous `ORDER BY` expressions.

## Adding `DISTINCT ON` expression (Postgres only)

When using both distinct-on with an order-by expression, the distinct-on expression must match the leftmost order-by.
The distinct-on expressions are interpreted using the same rules as order-by. Please note that, using distinct-on
without an order-by expression means that the first row of each set is unpredictable.

Adding a `DISTINCT ON` expression is easy as:

```typescript
selectDistinct()
  .from(User, "user")
  .orderBy("user.id");
```

Which will produce:

```sql
SELECT DISTINCT user.id, ...
FROM users as "user"
ORDER BY user.id
```

## Adding `GROUP BY` expression

Adding a `GROUP BY` expression is easy as:

```typescript
select()
  .from(User, "user")
  .groupBy("user.id");
```

Which will produce the following SQL query:

```sql
SELECT ... 
FROM users user 
GROUP BY user.id
```

To add more group-by criteria use `addGroupBy`:

```typescript
select()
  .from(User, "user")
  .groupBy("user.name")
  .addGroupBy("user.id");
```

If you use `.groupBy` more than once you'll override all previous `GROUP BY` expressions.

## Adding `LIMIT` expression

Adding a `LIMIT` expression is easy as:

```typescript
select()
  .from(User, "user")
  .limit(10);
```

Which will produce the following SQL query:

```sql
SELECT ... 
FROM users as "user"
LIMIT 10
```

The resulting SQL query depends on the type of database (SQL, mySQL, Postgres, etc). Note: LIMIT may not work as you may
expect if you are using complex queries with joins or subqueries. If you are using pagination, it's recommended to use
`take` instead.

## Adding `OFFSET` expression

Adding an SQL `OFFSET` expression is easy as:

```typescript
select()
  .from(User, "user")
  .offset(10);
```

Which will produce the following SQL query:

```sql
SELECT ...
FROM users as "user"
OFFSET 10
```

The resulting SQL query depends on the type of database (SQL, mySQL, Postgres, etc). Note: OFFSET may not work as you
may expect if you are using complex queries with joins or subqueries. If you are using pagination, it's recommended to
use `skip` instead.

## Joining relations

Let's say you have the following entities:

```typescript
import {Entity, PrimaryGeneratedColumn, Column} from `https://deno.land/x/spinosaurus/mod.ts`;

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}
```

```typescript
import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from `https://deno.land/x/spinosaurus/mod.ts`;;
import {User} from "./User";

@Entity()
export class Photo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

    @ManyToOne({ entity: User })
    user: any;
}
```

Now let's say you want to load user "Timber" with all of his photos:

```typescript
const user = await conn
  .select()
  .from({ entity: User, as: "user" })
  .leftAndSelect(Photo, "photo", `"photo"."userId" = "user"."id"`)
  .where("user.name = :name", { name: "Timber" })
  .getOne();
```

You'll get the following result:

```typescript
{
    "id": 1,
    "name": "Timber",
    "photo.userId": 1
    "photo.id": 1
    "photo.url": "me-with-chakram.jpg"
}
```

As you can see `leftAndSelect` automatically loaded all of Timber's photos. The first argument is the relation you want
to load and the second argument is an alias you assign to this relation's table. You can use this alias anywhere in
query builder. For example, let's take all Timber's photos which aren't removed.

```typescript
const user = await getConnection()
  .select()
  .from({ entity: User, as: "user" })
  .leftAndSelect(Photo, "photo", `"photo"."userId" = "user"."id"`)
  .where("user.name = :name", { name: "Timber" })
  .andWhere("photo.isRemoved = :isRemoved", { isRemoved: false })
  .getOne();
```

This will generate following sql query:

```sql
SELECT user.id,
    user.name,
    photo.userId,
    photo.id,
    photo.url
FROM "users" as "user"
LEFT JOIN photos as "photo" ON "photo"."user" = "user"."id"
WHERE user.name = 'Timber' 
AND photo.isRemoved = 0
```

You can also add conditions to the join expression instead of using "where":

```typescript
const user = await getConnection()
  .select()
  .from({ entity: User, as: "user" })
  .leftAndSelect(
    Photo,
    "photo",
    `"photo"."user" = "user"."id" AND "photo"."isRemoved" = :isRemoved`,
    { isRemoved: false },
  )
  .where("user.name = :name", { name: "Timber" })
  .getOne();
```

This will generate the following sql query:

```sql
SELECT user.id,
    user.name,
    photo.userId,
    photo.id,
    photo.url
FROM "users" as "user"
LEFT JOIN photos photo ON "photo"."user" = "user"."id" AND "photo"."isRemoved" = 0
WHERE user.name = 'Timber'
```

## Inner and left joins

If you want to use `INNER JOIN` instead of `LEFT JOIN` just use `joinAndSelect` instead:

```typescript
const user = await getConnection()
  .select()
  .from(User, "user")
  .joinAndSelect(
    Photo,
    "photo",
    `"photo"."user" = "user"."id" AND "photo"."isRemoved" = :isRemoved`,
    { isRemoved: false },
  )
  .where(`user.name = :name`, { name: "Timber" })
  .getOne();
```

This will generate:

```sql
SELECT user.id,
    user.name,
    photo.userId,
    photo.id,
    photo.url
FROM "users" as "user"
INNER JOIN photos AS "photo" ON "photo"."user" = "user"."id" AND "photo"."isRemoved" = 0
WHERE user.name = 'Timber'
```

The difference between `LEFT JOIN` and `INNER JOIN` is that `INNER JOIN` won't return a user if it does not have any
photos. `LEFT JOIN` will return you the user even if it doesn't have photos. To learn more about different join types,
refer to the [SQL documentation](https://msdn.microsoft.com/en-us/library/zt8wzxy4.aspx).

## Right joins

If you want to use `RIGHT JOIN` instead of `INNER JOIN` just use `rightAndSelect` instead:

```typescript
const user = await getConnection()
  .select()
  .from(Photo, "photo")
  .rightAndSelect(
    User,
    "user",
    `"user"."id" = "photo"."user" AND "photo"."isRemoved" = :isRemoved`,
    { isRemoved: false },
  )
  .where(`user.name = :name`, { name: "Timber" })
  .getOne();
```

This will generate:

```sql
SELECT photo.userId,
    photo.id,
    photo.url,
    user.id,
    user.name,
FROM photos AS "photo"
RIGHT JOIN users as "user" ON "user"."id" = "photo"."user" AND "photo"."isRemoved" = 0
WHERE user.name = 'Timber'
```

The difference between `RIGHT JOIN` and `INNER JOIN` is that `INNER JOIN` won't return a user if it does not have any
photos. `RIGHT JOIN` will return you the user even if it doesn't have photos. To learn more about different join types,
refer to the [SQL documentation](https://msdn.microsoft.com/en-us/library/zt8wzxy4.aspx).

## Join without selection

You can join data without its selection. To do that, use `leftJoin` or `innerJoin`:

```typescript
const user = await getConnection()
  .select()
  .from(User, "user")
  .join(Photo, "photo", `"photo"."userId" = "user"."id"`)
  .where("user.name = :name", { name: "Timber" })
  .getOne();
```

This will generate:

```sql
SELECT user.id,
    user.name,
    photo.userId,
    photo.id,
    photo.url
FROM "users" as "user"
INNER JOIN photos photo ON "photo"."user" = "user"."id" AND "photo"."isRemoved" = 0
WHERE user.name = 'Timber'
```

This will select Timber if he has photos, but won't return his photos.

## Joining any entity or table

You can join not only relations, but also other unrelated entities or tables. Examples:

```typescript
const user = await getConnection()
  .select()
  .from(User, "user")
  .leftAndSelect(Photo, "photo", "photo.userId = user.id")
  .getMany();
```

```typescript
const user = await getConnection()
  .select()
  .from(User, "user")
  .leftAndSelect({
    schema: "inter",
    entity: "photos",
    as: "photo",
    on: "photo.userId = user.id",
  })
  .getMany();
```

## Joining and mapping functionality

Add `profilePhoto` to `User` entity and you can map any data into that property using `QueryBuilder`:

```typescript
const user = await getConnection()
  .select()
  .from(User, "user")
  .leftAndWrap("inter.photos", "photos", "photos.userId = user.id")
  .getMany();
```

This will load Timber's profile photo and set it to `user.photo`. If you want to load and map a single entity use
`leftAndWrap`, `user.photos: Photo`. If you want to load and map multiple entities use `leftAndWrap`,
`user.photos: Array<Photo>`.

## Getting the generated query

Sometimes you may want to get the SQL query generated by `QueryBuilder`. To do so, use `getSql`:

```typescript
const sql = await getConnection()
  .select()
  .from(User, "user")
  .where("user.firstName = :firstName", { firstName: "Timber" })
  .orWhere("user.lastName = :lastName", { lastName: "Saw" })
  .getSql();
```

For debugging purposes you can use `printSql`:

```typescript
const users = await getConnection()
  .select()
  .from(User, "user")
  .where("user.firstName = :firstName", { firstName: "Timber" })
  .orWhere("user.lastName = :lastName", { lastName: "Saw" })
  .printSql()
  .getMany();
```

This query will return users and print the used sql statement to the console.

## Getting raw results

There are two types of results you can get using select query builder: **entities** and **raw results**. Most of the
time, you need to select real entities from your database, for example, users. For this purpose, you use `getOne` and
`getMany`. However, sometimes you need to select specific data, like the _sum of all user photos_. Such data is not a
entity, it's called raw data. To get raw data, you use `getOne` and `getMany` and use `select()` and `addSelect()`.
Examples:

```typescript
const { sum } = await getConnection()
  .select([`SUM(user."photosCount")`, "sum"])
  .from(User, "user")
  .where("user.id = :id", { id: 1 })
  .getOne();
```

```typescript
const photosSums = await getConnection()
  .select("user.id")
  .addSelect(`SUM(user."photosCount")`, "sum")
  .from(User, "user")
  .groupBy("user.id")
  .getMany();

// [{ id: 1, sum: 25 }, { id: 2, sum: 13 }, ...]
```

## Using pagination

Most of the time when you develop an application, you need pagination functionality. This is used if you have
pagination, page slider, or infinite scroll components in your application.

```typescript
const users = await getConnection()
  .select()
  .from(User, "user")
  .leftAndSelect({ entity: Photo, as: "photo", on: "photo.userId = user.id" })
  .take(10)
  .getMany();
```

This will give you the first 10 users with their photos.

```typescript
const users = await getConnection()
  .select()
  .from(User, "user")
  .leftAndSelect({ Photo, "photo", "photo.userId = user.id")
  .skip(10)
  .getMany();
```

This will give you all except the first 10 users with their photos. You can combine those methods:

```typescript
const users = await getConnection()
  .select()
  .from({ User, "user")
  .leftAndSelect({ Photo, "photo", "photo.userId = user.id")
  .skip(5)
  .take(10)
  .getMany();
```

This will skip the first 5 users and take 10 users after them.

`take` and `skip` may look like we are using `limit` and `offset`, but they aren't. `limit` and `offset` may not work as
you expect once you have more complicated queries with joins or subqueries. Using `take` and `skip` will prevent those
issues.

## Max execution time

We can drop slow query to avoid crashing the server. Only Postgres driver is supported at the moment:

```typescript
const users = await getConnection()
  .addConnectionOption({ maxExecutionTime: 1000 })
  .select()
  .from({ entity: User, as: "user" }) // milliseconds.
  .getMany();
```

## Hidden Columns

If the model you are querying has a column with a `select: false` column, you must use the `addSelect` function in order
to retrieve the information from the column.

Let's say you have the following entity:

```typescript
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ select: false })
  password: string;
}
```

Using a standard query, you will not receive the `password` property for the model. However, if you do the following:

```typescript
await getConnection()
  .select(["user.id", "id"])
  .addSelect(["user.password"])
  .from(User, "user")
  .getMany();
```

You will get the property `password` in your query.
