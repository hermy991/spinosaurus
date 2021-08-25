# Spinosaurus

Spinosaurus is a ORM that can run in deno (this project is inspired by typeORM)

## Features

- [ ] Supports both DataMapper and ActiveRecord (your choice)
- [x] Entities and columns
- [ ] Database-specific column types
- [ ] Entity manager
- [ ] Repositories and custom repositories
- [ ] Clean object relational model
- [ ] Associations (relations)
- [ ] Eager and lazy relations
- [ ] Uni-directional, bi-directional and self-referenced relations
- [ ] Supports multiple inheritance patterns
- [ ] Cascades
- [ ] Indices
- [ ] Transactions
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
- [ ] Schema declaration in models or separate configuration files
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

# Query Builder

## Query

### Example 1, simple retriving data from db

```typescript
let data = await db.select()
  .from({ entity: User })
  .getMany();
```

## Update

### Example 1, simple update data

```typescript
await db.update("User")
  .set({ userName: "yassett77", firstName: "Yassett" })
  .execute();
```

### Example 1, simple update multiple data

```typescript
await db.update("User")
  .from([{ user_ID: 1, userName: "hermy991", firstName: "Hermy" }, {
    user_ID: 2,
    userName: "yassett77",
    firstName: "Yassett",
  }])
  .execute();
```

## Insert

### Example 1, simple insert data

```typescript
await db.insert("User")
  .values([{ userName: "hermy991", firstName: "Hermy" }, {
    userName: "yassett77",
    firstName: "Yassett",
  }])
  .execute();
```

### Example 2, simple update multiple data

```typescript
await db.insert("User")
  .from([{ user_ID: 1, userName: "hermy991", firstName: "Hermy" }, {
    userName: "yassett77",
    firstName: "Yassett",
  }])
  .execute();
```

### Example 3, more simple update multiple data

```typescript
import { User } from "./user.ts";
await db.insert(User)
  .columns(["userName"])
  .from([{ user_ID: 1, userName: "hermy991", firstName: "Hermy" }, {
    userName: "yassett77",
    firstName: "Yassett",
  }])
  .where([`"ege" >= 18`])
  .execute();
```

# Scripts (Velociraptor)

<!-- ## Test file
```bash
deno run -qA https://code.velociraptor.run <SCRIPT>
``` -->

## Test all

```bash
deno run -qA https://code.velociraptor.run test
```

## Test one

```bash
deno run -qA https://code.velociraptor.run test:one tests/unit/decorator_column_executor_test.ts
```

## Test SQL

```bash
deno run -qA https://code.velociraptor.run test:sql
```

## Test Executor

```bash
deno run -qA https://code.velociraptor.run test:exec
```

# TODO

- documentation
- code coments
- testing getMetadata, getTempMetadata, clearMetadata, clearTempMetadata
- testing primary column executor testing
- testing generated column executor testing
- configuration env and files flow
- column, unique, check alter testing
- alter column (implement primary key and auto-increment)
- testing for generate columns from entity in select using options
- adding primary key column in each delete
- using entity in select, example select().from(Entity)
- throw a error when @UpdateColumn property is not a Number type
- adding interpolation list
  `( '"primaryKey" IN(:primaryKey)',  { primaryKey: [ 1, 2, 3, 4 ] })`
- implement in @InsertColumn, @UpdateColumn (value) and ({options}, value)
  params
- does not update object without primary key in entity mode (updating a antity),
  create testing too
- create a option in update entity option witch can update without a primary key
- does not insert object with a primary generated property in entity mode
- create a option in insert entity option witch can insert with a primary
  generated key
- adding joinAndWrap, leftAndWrap, rigthAndWrap and exec testing, remember
  include in joinAndSelect, joinAndSelect, joinAndSelect as a option (wrap:
  boolean)
- suport multiple connection
- set insert primary column as options and add testing
- set update primary column as options and add testing
- set upsert primary column as options and add testing
- change Spi to Param type name
