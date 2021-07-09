# Spinosaurus

Spinosaurus is a ORM that can run in deno (this project is inspired by typeORM)

## Future

- [ ] Supports both DataMapper and ActiveRecord (your choice)
- [ ] Entities and columns
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
- [ ] Elegant-syntax, flexible and powerful QueryBuilder
- [ ] Left and inner joins
- [ ] Proper pagination for queries using joins
- [x] Query caching
- [ ] Streaming raw results
- [ ] Logging
- [ ] Listeners and subscribers (hooks)
- [ ] Supports closure table pattern
- [ ] Schema declaration in models or separate configuration files
- [ ] Connection configuration in json / xml / yml / env formats
- [ ] Database supports
  - [x] Postgresql
  - [ ] MySql / MariaDB
  - [ ] Microsoft Sql Server
  - [ ] Oracle
- [ ] Supports MongoDB NoSQL database
- [ ] works in platforms
  - [ ] Deno
  - [ ] NodeJS
  - [ ] Browser
  - [ ] Electron
- [ ] Language support
  - [ ] JavaScript
  - [ ] TypeScript
- [ ] Produced code is performant, flexible, clean and maintainable
- [ ] Follows all possible best practices
- [ ] CLI

# Query Builder

## Query

### Example 1, simple retriving data from db

```typescript
let data = await db.select()
  .from("User")
  .getRawMany();
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

## Test SQL

```bash
deno run -qA https://code.velociraptor.run test:query
```

## Test Executor

```bash
deno run -qA https://code.velociraptor.run test:executor
```
