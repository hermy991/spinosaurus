# Spinosaurus

Spinosaurus is a ORM that can run in deno platforms and can be use with TypeScript. Its goal is to always support the
latest TypeScript features and provide additional features that help you to develop any kind of application that uses
databases - from small applications with a few tables to large scale enterprise applications with multiple databases.
(this project is inspired by typeORM)

## Features

- [ ] Supports both DataMapper and ActiveRecord (your choice)
- [x] Entities and columns
- [ ] Database-specific column types
- [ ] Entity manager
- [ ] Repositories and custom repositories
- [ ] Clean object relational model
- [ ] Associations (relations)
  - [x] Uni-directional relations
  - [ ] Bi-directional relations
  - [x] Self-referenced relations
- [ ] Eager and lazy relations
- [x] Supports multiple inheritance patterns
- [ ] Cascades
- [ ] Indices
- [x] Transactions
- [ ] Migrations and automatic migrations generation
- [ ] Connection pooling
- [ ] Replication
- [ ] Using multiple database connections
- [ ] Working with multiple databases types
- [ ] Cross-database and cross-schema queries
- [x] Elegant-syntax, flexible and powerful QueryBuilder
- [x] Left and inner joins
- [ ] Proper pagination for queries using joins
- [x] Query caching
- [ ] Streaming raw results
- [x] Logging
- [ ] Listeners and subscribers (hooks)
- [ ] Supports closure table pattern
- [x] Schema declaration in models or separate configuration files
- [x] Connection configuration in json / xml / yml / yaml / env formats
- [ ] Database supports
  - [x] Postgresql
  - [ ] MySql / MariaDB
  - [ ] Microsoft Sql Server
  - [ ] Oracle
- [ ] Supports MongoDB NoSQL database
- [ ] works in platforms
  - [x] Deno
  - [ ] NodeJS
  - [ ] Browser
  - [ ] Electron
- [ ] Language support
  - [ ] JavaScript
  - [x] TypeScript
- [ ] Produced code is performant, flexible, clean and maintainable
- [ ] Follows all possible best practices
- [ ] CLI

## Scripts (Velociraptor)

### Test all

```bash
deno run -qA https://code.velociraptor.run test
```

### Test one

```bash
deno run -qA https://code.velociraptor.run test:one tests/unit/decorator_column_executor_test.ts
```

### Test SQL

```bash
deno run -qA https://code.velociraptor.run test:sql
```

### Test Executor

```bash
deno run -qA https://code.velociraptor.run test:exec
```

## TODO

- documentation
- code coments
- testing getMetadata, getTempMetadata, clearMetadata, clearTempMetadata create(...).columns() functions
- testing primary column executor testing
- testing generated column executor testing
- column, unique, check alter testing
- alter column (implement primary key and auto-increment)
- testing for generate columns from entity in select using options
- adding primary key column in each delete
- throw a error when @UpdateColumn property is not a Number type
- implement in @InsertColumn, @UpdateColumn (value) and ({options}, value) params
- does not update object without primary key in entity mode (updating a antity), create testing too
- create a option in update entity option witch can update without a primary key
- adding joinAndOne, leftAndOne, rigthAndOne and exec testing, remember include in joinAndSelect, joinAndSelect,
- adding joinAndWrap, leftAndWrap, rigthAndWrap and exec testing, remember include in joinAndSelect, joinAndSelect,
  joinAndSelect as a option (wrap: boolean)
- suport multiple connection
- rename a column, using index in @Column({ columnIndex: 3 })
- create a method getOneOrFail, it throw a exeption if it does not have one row
- reverse interpolate transform this `user.propertyKey` to `"user"."columnName"` | `[user].[columnName]` |
  `` `user`.`columnName` ``, this transformation depends on database type
- create skip
- create take
- set maxExecutionTime as a option in select, insert, update, delete and transaction
- numeric param in `groupBy`, `addGroupBy`, `orderBy`, `addOrderBy` and set select definition internally
- change `from({ entity: Entity })` to `from(Entity, "e")` on documentation and code
- `orderBy({ "p.passwordOrder": "DESC" })`
- change param `orderBy` and `addOrderBy` strategic from ... to array
- using path in Next and After in decorators and query builder
- updating database with createConnection
- check constraint ending with `*_not_null` should throw a error
- make a test by diferences in column quantity and position on reference decorators
- adding tinyint in spitype
- use IndexDb, very in the future
- use a structure equals to indexDB to store entities
- `whereInIds([ 1, 2, 3, 4 ])` transform to
  ```
  ```
- implement insert into select, update from select, maybe upsert from select
  ```typescript
  /*update from select*/
  await conn.update(User).set({ userDisplay: () => `p."firstName"` })
    .from(User, "u").join(Person, "p", `p."person_ID" = u."person_ID"`);

  /*insert into select*/
  await conn.insert(User).values({ userDisplay: () => `p."firstName"` })
    .from(User, "u").join(Person, "p", `p."person_ID" = u."person_ID"`);
  ```

- Make the next code work:

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
- implementing query builder short form:
  `await conn.update(User).set(user).execute(); -> await conn.update(user).execute();`,
  `await conn.insert(User).values(user).execute(); -> await conn.insert(user).execute();` and
  `await conn.upsert(User).values(user).execute(); -> await conn.upsert(user).execute();`

- escape in insert, update, and upsert like the following code:

```typescript
  const db = await getConnection();
  await db.insert(Company)
  .values({
    companyName: "Timber",
    dateFormat: () => `"dateFormat" + :dateFormat`,
  })
  .params({ dateFormat: "dd/MM/yyyy" })
  .execute();
  
  ...

  const db = await getConnection();
  await db.insert(Company)
  .values({
    companyName: "Timber",
    dateFormat: () => [`"dateFormat" + :dateFormat`, { dateFormat: "dd/MM/yyyy" }],
  })
  .execute();
```

- implementing `db.softDelete`, when you use a `@DeleteColumn` decorator in a `boolean` or `Date` types, it performes a
  update changing the column's value.

- implementing `db.restoreDelete`, when you use a `@DeleteColumn` decorator in a `boolean` or `Date` types, it performes
  a update changing the column's value to maked visible.

- implementing `@Transaction` decorator as follows:

```typescript
async function save(conection: Connection, user: User) {
  await connection.upsert(User).values(user).execute();
}
```

- implementing caching result:
  - files or memory storage
  - timer and query diferences
