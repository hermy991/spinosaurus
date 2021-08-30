# Connection Options

- [What is `ConnectionOptions`](#what-is-connectionoptions)
- [Common connection options](#common-connection-options)
- [`postgres` connection options](#postgres-connection-options)
- [Connection options example](#connection-options-example)

## What is `ConnectionOptions`

Connection options is a connection configuration you pass to `createConnection`
or define in `spinosaurus` file. Different databases have their own specific
connection options.

## Common connection options

- `name` - Connection name. You'll use it to get connection you need using
  `getConnection(name: string)`. Connection names for different connections
  cannot be same - they all must be unique. If connection name is not given then
  it will be called "default".

- `type` - Database type. You must specify what database engine you use.
  Possible values are "mysql", "postgres", "mariadb", "oracle", "mssql". This
  option is **required**.

- `entities` - Entities, or Entity Schemas, to be loaded and used for this
  connection. Accepts both entity classes, entity schema classes, and
  directories paths to load from. Directories support glob patterns. Example:
  `entities: [Post, Category, "entity/*.js", "modules/**/entity/*.js"]`. Learn
  more about [Entities](../03_entities/00_entities.md).

- `synchronize` - Indicates if database schema should be auto created on every
  application launch. Be careful with this option and don't use this in
  production - otherwise you can lose production data. This option is useful
  during debug and development. As an alternative to it, you can use CLI and run
  schema:sync command. Note that for MongoDB database it does not create schema,
  because MongoDB is schemaless. Instead, it syncs just by creating indices.

## `postgres` connection options

- `host` - Database host.

- `port` - Database host port. Default postgres port is `5432`.

- `username` - Database username.

- `password` - Database password.

- `database` - Database name.

## Connection options example

Here is a small example of connection options for mysql:

```typescript
{
    host: "localhost",
    port: 3306,
    username: "test",
    password: "test",
    database: "test",
    logging: true,
    synchronize: true,
    entities: [
        "entity/*.js"
    ],
}
```
