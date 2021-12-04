# Upsert using Query Builder

You can create `INSERT` or `UPDATE` queries using `QueryBuilder`. Examples:

```typescript
import { getConnection } from "https://deno.land/x/spinosaurus/mod.ts";

await getConnection().upsert(User)
  .values([
    { firstName: "Timber", lastName: "Saw" },
    { firstName: "Phantom", lastName: "Lancer" },
  ])
  .execute();
```

This is the most efficient way in terms of performance to upsert rows into your database. You can also perform bulk
insertions and update entities this way.

### Raw SQL support

In some cases when you need to execute SQL queries you need to use function style value:

```typescript
import { getConnection } from "https://deno.land/x/spinosaurus/mod.ts";

await getConnection().upsert(User)
  .values({
    firstName: "Timber",
    lastName: () => `UPPER("lastName")`,
  })
  .execute();
```

This syntax at the moment doesn't escape your values, you need to handle escape on your own.
