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
- [ ] Logging
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
  ``addWhere(```"primaryKey" IN(:primaryKey)```,  { primaryKey: [ 1, 2, 3, 4 ] })``
- adding param structure in all query builder
  ```typescript
  ... .from({ entity: User, as: "u" })                        -> ... .from(User, "u")
  ... .join({ entity: User, as: "u", on: `u."user_ID" = 1` }) -> ... .join(User, "u", `u."user_ID" = 1`)
  ```
- implement insert into select, update from select, maybe upsert from select
  ```typescript
  /*update from select*/
  await conn.update(User).set({ userDisplay: () => `p."firstName"` })
      .from(User, "u").join(Person, "p", `p."person_ID" = u."person_ID"`)

  /*insert into select*/
  await conn.insert(User).values({ userDisplay: () => `p."firstName"` })
      .from(User, "u").join(Person, "p", `p."person_ID" = u."person_ID"`)
  ```
