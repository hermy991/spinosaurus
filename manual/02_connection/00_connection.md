# Working with Connection

- [What is `Connection`](#what-is-connection)
- [Creating a new connection](#creating-a-new-connection)

## What is `Connection`

Your interaction with the database is only possible once you setup a connection. Spinosaurus's `Connection` does not
setup a database connection as it might seem. Generally, you must create connection only once in your application
bootstrap, and close it after you completely finished working with the database. In practice, if you are building a
backend for your site and your backend server always stays running - you never close a connection.

## Creating a new connection

There are several ways how a connection can be created. The most simple and common way is to use `createConnection`
function.

`createConnection` creates a single connection:

```typescript
import { Connection, createConnection } from `https://deno.land/x/spinosaurus/mod.ts`;

const connection = await createConnection({
  type: "postgres",
  host: "localhost",
  port: 3306,
  username: "test",
  password: "test",
  database: "test",
});
```

Both these functions create `Connection` based on connection options you pass and call a `execute`, `getOne` and
`getMany` method. You can create [spinosaurus.json](./01_using-configs.md) file in the root of your project and
connection options will be automatically read from this file by those methods. Root of your project is the same level
where deno is running.

```typescript
import { Connection, createConnection, createConnections } from `https://deno.land/x/spinosaurus/mod.ts`;

// here createConnection will load connection options from
// spinosaurus.[format] config.json / spinosaurus.[format] config.js / spinosaurus.[format] config.yml / spinosaurus.[format] config.env / spinosaurus.[format] config.xml
// files, or from special environment variables
const connection: Connection = await createConnection();

// you can specify the name of the connection to create
// (if you omit name it will create a connection without name specified)
const secondConnection: Connection = await createConnection("test2-connection");
```

Different connections must have different names. By default, if connection name is not specified it's equal to
`default`. Usually, you use multiple connections when you use multiple databases or multiple connection configurations.

Once you created a connection you can obtain it anywhere from your app, using `getConnection` function:

```typescript
import { getConnection } from `https://deno.land/x/spinosaurus/mod.ts`;

// can be used once createConnection is called and is resolved
const connection = getConnection();

// if you have multiple connections you can get connection by name
const secondConnection = getConnection("test2-connection");
```

Avoid creating extra classes / services to store and manage your connections. This functionality is already embedded
into Spinosaurus - you don't need to overengineer and create useless abstractions.
