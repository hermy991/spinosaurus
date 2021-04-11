# Spinosaurus
Spinosaurus is a ORM that can run in deno (this project is inspired by typeORM)

# Suported Databases
- [ ] Postgresql
- [ ] MySql
- [ ] Sql Server
# Query Builder
## Query
### Example 1, retriving data from raw sql
```typescript
db.select().from("User").getRaw();
```
### Example 2, retriving data and set in objects
```typescript
db.select().from("User").getMany();
db.select().from("User").getOne();
```