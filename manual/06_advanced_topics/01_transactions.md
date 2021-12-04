# Transactions

- [Creating and using transactions](#creating-and-using-transactions)
  - [Specifying Isolation Levels](#specifying-isolation-levels)
- [Transaction decorators](#transaction-decorators)
- [Using `QueryRunner` to create and control state of single database connection](#using-queryrunner-to-create-and-control-state-of-single-database-connection)

## Creating and using transactions

Transactions are created using `Connection`. Examples:

```typescript
import { getConnection } from "https://deno.land/x/spinosaurus/mod.ts";
import { User } from "./User.ts";

await (await getConnection()).startTransaction(async (connection) => {
  ...
  await connection.delete(User).execute();
  ...
});
```

or

```typescript
import { getConnection } from "https://deno.land/x/spinosaurus/mod.ts";
import { User } from "./User.ts";

const conn = getConnection();
await conn.startTransaction(async () => {
  ...
  await conn.delete(User).execute();
  ...
});
```

Everything you want to run in a transaction must be executed in a callback, rollback is automatic on any kind of error:

```typescript
import { getConnection } from "https://deno.land/x/spinosaurus/mod.ts";
import { User } from "./User.ts";

const conn = getConnection();
await conn.startTransaction(async () => {
  ...
  await conn.delete(User).execute();
  throw { mesage: "Rollback perform" };
  ...
});
```

## Transaction decorators

Comming soon ...

## Using `Connection` to create and control state of single database connection

`Connection` provides a single database connection. Transactions are organized using query connections. Single
transactions can only be established on a single query run ner. Example:

```typescript
import { getConnection } from "https://deno.land/x/spinosaurus/mod.ts";
import { User } from "./User.ts";
import { UserVersion } from "./UserVersion.ts";
import { UserLog } from "./UserLog.ts";

// get a connection and create a new query runner
const connection = await getConnection();

// now we can execute any queries on a query builder, for example:
const users = await connection.from("users").getMany();

// lets now open a new transaction:
await queryRunner.startTransaction();

try {
  // execute some operations on this transaction:
  await connection.insert(UserVersion).values(users).execute();
  await connection.insert(UserLog).values(users).execute();
  if (users.length) {
  }
  // commit transaction now:
  await connection.commitTransaction();
} catch (err) {
  // since we have errors let's rollback changes we made
  await connection.rollbackTransaction();
}
```

There are 3 methods to control transactions in `Connection`:

- `startTransaction` - starts a new transaction inside the connection instance.
- `commitTransaction` - commits all changes made using the connection instance.
- `rollbackTransaction` - rolls all changes made using the connection instance back.

You can give a transaction name in any transaction method.
