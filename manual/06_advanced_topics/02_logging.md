# Logging

- [Enabling logging](#enabling-logging)
- [Logging options](#logging-options)
- [Log long-running queries](#log-long-running-queries)
- [Changing default logger](#changing-default-logger)
- [Using custom logger](#using-custom-logger)

## Enabling logging

You can enable logging of all queries and errors by simply setting `logging: true` in your connection options:

```typescript
{
    name: "mysql",
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "test",
    password: "test",
    database: "test",
    ...
    logging: true
}
```

The las connection configuration outputs `query` and `schema` loggings.

## Logging options

You can enable different types of logging in connection options:

```typescript
{ 
    host: "localhost",
    ...
    logging: ["query", "schema"]
}
```

<!-- If you want to enable logging of failed queries only then only add `error`:

```typescript
{
    host: "localhost",
    ...
    logging: ["error"]
}
``` -->

There are other options you can use:

- `query` - logs all queries.

<!-- - `error` - logs all failed queries and errors. -->

- `schema` - logs the schema build process.

<!-- - `warn` - logs internal orm warnings.
- `info` - logs internal orm informative messages.
- `log` - logs internal orm log messages. -->

You can specify as many options as needed. If you want to enable all logging you can simply specify `logging: "all"`:

```typescript
{
    host: "localhost",
    ...
    logging: "all"
}
```

## Changing default logger

Spinosaurus ships with 2 different types of logger:

<!-- - `advanced-console` - this is the default logger which logs all messages into the console using color and sql syntax
  highlighting (using [chalk](https://github.com/chalk/chalk)). -->

- `simple-console` - this is a simple console logger which is exactly the same as the advanced logger, but it does not
  use any color highlighting. This logger can be used if you have problems / or don't like colorized logs.
- `file` - this logger writes all logs into `spinosaurus.log` in the root folder of your project (where deno is
  running).

<!-- - `debug` - this logger uses [debug package](https://github.com/visionmedia/debug), to turn on logging set your env
  variable `SPINOSAURUS_CONN_LOGGING=spinosaurus:*` (note logging option has no effect on this logger). -->

You can enable `simple-console` of them in connection options:

```typescript
{
    host: "localhost",
    ...
    logging: true,
}
```

You can enable `file` of them in connection options:

```typescript
{
    host: "localhost",
    ...
    logging: "{DEFAULT_FILE}"
}
```

## Using custom logger

You can create your own logger function by using `setLogger()` method:

And specify it in connection options:

```typescript
import { createConnection } from "https://deno.land/x/spinosaurus/mod.ts";

const db = await createConnection({
  name: "mysql",
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "test",
  password: "test",
  database: "test",
  logger: true,
});
let lines: string[] = [];
function log(line: string, options?: any) {
  lines.push(line);
}
db.getLogging(), setLogChannel(log);
```
