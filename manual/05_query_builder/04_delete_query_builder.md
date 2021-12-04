# Delete using Query Builder

- [Delete using Query Builder](#delete-using-query-builder)
  - [`Delete`](#delete)
  - [`Soft-Delete`](#soft-delete)
  - [`Restore-Soft-Delete`](#restore-soft-delete)

### `Delete`

You can create `DELETE` queries using `QueryBuilder`. Examples:

```typescript
import { getConnection } from "https://deno.land/x/spinosaurus/mod.ts";

await getConnection().delete(User)
  .where("id = :id", { id: 1 })
  .execute();
```

This is the most efficient way in terms of performance to delete entities from your database

### `Soft-Delete`

Comming soon ...

### `Restore-Soft-Delete`

Comming soon ...
