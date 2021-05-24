# Spinosaurus
Spinosaurus is a ORM that can run in deno (this project is inspired by typeORM)

# Suported Databases
- [ ] Postgresql
- [ ] MySql
- [ ] Sql Server
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
				.set({ userName: "yassett77", firstName: "Yassett"})
				.execute();
```
### Example 1, simple update multiple data
```typescript
await db.update("User")
        .from([{ user_ID: 1, userName: "hermy991", firstName: "Hermy"},
        { user_ID: 2, userName: "yassett77", firstName: "Yassett"}])
        .execute();
```
## Insert
### Example 1, simple insert data
```typescript
await db.insert("User")
        .values([{ userName: "hermy991", firstName: "Hermy"}, { userName: "yassett77", firstName: "Yassett"}])
        .execute();
```
### Example 2, simple update multiple data
```typescript
await db.insert("User")
        .from([{ user_ID: 1, userName: "hermy991", firstName: "Hermy"}, 
        { userName: "yassett77", firstName: "Yassett"}])
        .execute();
```
### Example 3, more simple update multiple data
```typescript
import {User} from './user.ts';
await db.insert(User)
				.columns(["userName"])
				.from([{ user_ID: 1, userName: "hermy991", firstName: "Hermy"}, 
				{ userName: "yassett77", firstName: "Yassett"}])
				.where([`"ege" >= 18`])
				.execute();
```
