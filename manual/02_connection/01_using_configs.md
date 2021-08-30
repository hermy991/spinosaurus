# Using Configuration Sources

- [Creating a new connection from the configuration
  file](#creating-a-new-connection-from-the-configuration-file)
- [Using environment variables](#using-environment-variables)
- [Using `spinosaurus.env`](#using-spinosaurusenv)
- [Using `spinosaurus.js` and
  `spinosaurus.ts`](#using-spinosaurusjs-and-spinosaurusts)
- [Using `spinosaurus.json`](#using-spinosaurusjson)
- [Using `spinosaurus.yml` and
  `spinosaurus.yaml`](#using-spinosaurusyml-and-spinosaurusyaml)
- [Using `spinosaurus.xml`](#using-spinosaurusxml)
- [Overriding options defined in
  spinosaurus](#overriding-options-defined-in-spinosaurus)

## Creating a new connection from the configuration file

Most of the times you want to store your connection options in a separate
configuration file. It makes it convenient and easy to manage. Spinosaurus
supports multiple configuration sources. You only need to create a
`spinosaurus.[format]` file in the root directory of your application (where
deno is running), put your configuration there and in your app call
`createConnection()` without any configuration passed:

```typescript
import { createConnection } from `https://deno.land/x/spinosaurus/mod.ts`;

// createConnection method will automatically read connection options
// from your spinosaurus config file or environment variables
const connection = await createConnection();
```

Supported spinosaurus config file formats are: `.env`, `.js`, `.ts`, `.json`,
`.yml`, `.yaml` and `.xml`.

## Using environment variables

Create `.env` or `spinosaurus.env` in the project root (where deno is running).
It should have the following content:

```ini
SPINOSAURUS_CONN_NAME = conn1
SPINOSAURUS_CONN_TYPE = postgres
SPINOSAURUS_CONN_HOST = localhost
SPINOSAURUS_CONN_USERNAME = root
SPINOSAURUS_CONN_PASSWORD = admin
SPINOSAURUS_CONN_DATABASE = test
SPINOSAURUS_CONN_PORT = 3000
SPINOSAURUS_CONN_SYNCHRONIZE = true
SPINOSAURUS_CONN_ENTITIES = entity/*.ts,modules/**/entity/*.ts
```

List of available env variables you can set:

- SPINOSAURUS_CONN_NAME
- SPINOSAURUS_CONN_TYPE
- SPINOSAURUS_CONN_HOST
- SPINOSAURUS_CONN_USERNAME
- SPINOSAURUS_CONN_PASSWORD
- SPINOSAURUS_CONN_DATABASE
- SPINOSAURUS_CONN_PORT
- SPINOSAURUS_CONN_SYNCHRONIZE
- SPINOSAURUS_CONN_ENTITIES

`spinosaurus.env` should be used only during development. On production you can
set all these values in real ENVIRONMENT VARIABLES.

You cannot define multiple connections using an `env` file or environment
variables. If your app has multiple connections then use alternative
configuration storage format.

## Using `spinosaurus.js` and `spinosaurus.ts`

Create `spinosaurus.js` in the project root (where deno is runing). It should
have following content:

```javascript
export default {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "test",
  password: "test",
  database: "test",
  entities: "entity/*.ts,modules/**/entity/*.t",
};
```

If you want to create multiple connections then simply create multiple
connections in a single array (default is the first one):

```javascript
export default [{
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "test",
  password: "test",
  database: "test",
  entities: "entity/*.ts,modules/**/entity/*.t",
}, {
  name: "second-connection",
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "test",
  password: "test",
  database: "test",
  entities: "entity/*.ts,modules/**/entity/*.t",
}];
```

You can also use typescript (it's the same code);

```typescript
export default {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "test",
  password: "test",
  database: "test",
  entities: "entity/*.ts,modules/**/entity/*.t",
};
```

## Using `spinosaurus.json`

Create `spinosaurus.json` in the project root (where deno is running). It should
have the following content:

```json
{
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": "test",
  "password": "test",
  "database": "test",
  "entities": "entity/*.ts,modules/**/entity/*.t"
}
```

You can specify any other options from
[ConnectionOptions](./02_connection-options.md).

If you want to create multiple connections then simply create multiple
connections in a single array (default is the first one):

```json
[{
  "name": "default",
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": "test",
  "password": "test",
  "database": "test",
  "entities": "entity/*.ts,modules/**/entity/*.t"
}, {
  "name": "second-connection",
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": "test",
  "password": "test",
  "database": "test",
  "entities": "entity/*.ts,modules/**/entity/*.t"
}]
```

## Using `spinosaurus.yml` and `spinosaurus.yaml`

Create `spinosaurus.yml` in the project root (where deno is running). It should
have the following content:

```yml
name: "con1"
type: "postgres"
host: "localhost"
port: 5432
username: "test"
password: "test"
database: "test"
entities: "entity/*.ts,modules/**/entity/*.t"
```

If you want to create multiple connections then simply create multiple
connections in a single array (default is the first one):

```yml
-
  name: "default"
  type: "postgres"
  host: "11.001.0.1"
  port: 5432
  username: "test"
  password: "test"
  database: "test2"
  entities: "entity/*.ts,modules/**/entity/*.t"
-
  name: "con1"
  type: "postgres"
  host: "localhost"
  port: 5432
  username: "test"
  password: "test"
  database: "test"
  entities: "entity/*.ts,modules/**/entity/*.t"
```

You can also use yaml (it's the same code);

```yaml
name: "con1"
type: "postgres"
host: "localhost"
port: 5432
username: "test"
password: "test"
database: "test"
entities: "entity/*.ts,modules/**/entity/*.t"
```

You can use any connection options available.

## Using `spinosaurus.xml`

Create `spinosaurus.xml` in the project root (where deno is running). It should
have the following content:

```xml
<connection type="mysql" name="default">
    <name>con1</host>
    <type>postgres</host>
    <host>localhost</host>
    <username>root</username>
    <password>admin</password>
    <database>test</database>
    <port>5432</port>
    <entities>entity/*.ts,modules/**/entity/*.ts</entities>
</connection>
```

You can use any connection options available.

## Which configuration file is used by Spinosaurus

Sometimes, you may want to use multiple configurations using different formats.
When calling `getConnectionOptions()` or attempting to use `createConnection()`
without the connection options, Spinosaurus will attempt to load the
configurations, in this order:

1. From the environment variables. Spinosaurus will attempt to load the `.env`
   file using dotEnv if it exists. If the environment variables
   `SPINOSAURUS_CONN_NAME`, `SPINOSAURUS_CONN_TYPE` and `SPINOSAURUS_CONN_HOST`
   are set, Spinosaurus will use this method.
2. From the `spinosaurus.env`.
3. From the other `spinosaurus.[format]` files, in this order:
   `[js, ts, json, yml, yaml, xml]`.

Note that Spinosaurus will use the first valid method found and will not load
the others. For example, Spinosaurus will not load the `spinosaurus.[format]`
files if the configuration was found in the environment.

## Overriding options defined in spinosaurus config

Sometimes you want to override values defined in your spinosaurus config file,
or you might want to append some TypeScript / JavaScript logic to your
configuration.

In such cases you can load options from spinosaurus config and get
`ConnectionOptions` built, then you can do whatever you want with those options,
before passing them to `createConnection` function:

```typescript
// read connection options from spinosaurus config file (or ENV variables)
const connectionOptions = await getConnectionOptions();

// do something with connectionOptions,
// for example append a custom naming strategy or a custom logger
Object.assign(connectionOptions, { password: "123456" });

// create a connection using modified connection options
const connection = await createConnection(connectionOptions);
```
