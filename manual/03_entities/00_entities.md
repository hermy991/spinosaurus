# Entities

- [What is Entity?](#what-is-entity)
- [Entity columns](#entity-columns)
  - [Primary columns](#primary-columns)
  - [Special columns](#special-columns)
- [Column types](#column-types)
  - [Column types for `postgres`](#column-types-for-postgres)
  - [`enum` column type](#enum-column-type)
  - [Columns with generated values](#columns-with-generated-values)
- [Column options](#column-options)

## What is Entity?

Entity is a class that maps to a database table (or collection when using MongoDB). You can create an entity by defining
a new class and mark it with `@Entity()`:

```typescript
import { Column, Entity, PrimaryGeneratedColumn } from "https://deno.land/x/spinosaurus/mod.ts";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  isActive: boolean;
}
```

This will create following database table:

```shell
+-------------+--------------+----------------------------+
|                          user                           |
+-------------+--------------+----------------------------+
| id          | int(11)      | PRIMARY KEY AUTO_INCREMENT |
| firstName   | varchar(255) |                            |
| lastName    | varchar(255) |                            |
| isActive    | boolean      |                            |
+-------------+--------------+----------------------------+
```

Basic entities consist of columns and relations. Each entity **MUST** have a primary column.

Each entity must be registered in your connection options:

```typescript
import { Connection, createConnection } from "https://deno.land/x/spinosaurus/mod.ts";
import { User } from "./entity/User";

const connection: Connection = await createConnection({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "test",
  password: "test",
  database: "test",
  entities: [User],
});
```

Or you can specify the whole directory with all entities inside - and all of them will be loaded:

```typescript
import { Connection, createConnection } from "https://deno.land/x/spinosaurus/mod.ts";

const connection: Connection = await createConnection({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "test",
  password: "test",
  database: "test",
  entities: ["entity/*.js"],
});
```

If you want to use an alternative table name for the `User` entity you can specify it in `@Entity`:
`@Entity("my_users")`. If you want to set a base prefix for all database tables in your application you can specify
`entityPrefix` in connection options.

When using an entity constructor its arguments **must be optional**. Since ORM creates instances of entity classes when
loading from the database, therefore it is not aware of your constructor arguments.

Learn more about parameters `@Entity` in [Decorators reference](decorator-reference.md).

## Entity columns

Since database tables consist of columns your entities must consist of columns too. Each entity class property you
marked with `@Column` will be mapped to a database table column.

### Primary columns

Each entity must have at least one primary column. There are several types of primary columns:

- `@PrimaryColumn()` creates a primary column which takes any value of any type. You can specify the column type. If you
  don't specify a column type it will be inferred from the property type. The example below will create id with `int` as
  type which you must manually assign before save.

```typescript
import { Entity, PrimaryColumn } from "https://deno.land/x/spinosaurus/mod.ts";

@Entity()
export class User {
  @PrimaryColumn()
  id: number;
}
```

- `@PrimaryGeneratedColumn()` creates a primary column which value will be automatically generated with an
  auto-increment value. It will create `int` column with `auto-increment`/`serial`/`sequence` (depend on the database).
  You don't have to manually assign its value before save - value will be automatically generated.

```typescript
import { Entity, PrimaryGeneratedColumn } from "https://deno.land/x/spinosaurus/mod.ts";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
}
```

- `@PrimaryGeneratedColumn("uuid")` creates a primary column which value will be automatically generated with
  `{ autoIncrement: "uuid"}`. Uuid is a unique string id. You don't have to manually assign its value before save -
  value will be automatically generated.

```typescript
import { Entity, PrimaryGeneratedColumn } from "https://deno.land/x/spinosaurus/mod.ts";

@Entity()
export class User {
  @PrimaryGeneratedColumn({ autoIncrement: "uuid" })
  id!: string;
}
```

### Special columns

There are several special column types with additional functionality available:

- `@InsertColumn` is a special column that is automatically set to the entity's insertion time in `autoInsert` param.
  You don't need to set this column - it will be automatically set.

- `@UpdateColumn` is a special column that is automatically set to the entity's update time each time you call `execute`
  of query builder. You don't need to set this column - it will be automatically set.

- `@VersionColumn` is a special column that is automatically set to the version of the entity (incremental number)\
  each time you call `execute` of query builder. You don't need to set this column - it will be automatically set.

## Column types

TypeORM supports all of the most commonly used database-supported column types. Column types are database-type
specific - this provides more flexibility on how your database schema will look like.

You can specify column type as first parameter of `@Column` or in the column options of `@Column`, for example:

```typescript
@Column({ spitype: "int" })
```

If you want to specify additional type parameters you can do it via column options. For example:

```typescript
@Column({ spitype: "int", width: 200 })
```

> Note about `bigint` type: `bigint` column type, used in SQL databases, doesn't fit into the regular `number` type and
> maps property to a `string` instead.

### Column types for `postgres`

`int`, `int2`, `int4`, `int8`, `smallint`, `integer`, `bigint`, `decimal`, `numeric`, `real`, `float`, `float4`,
`float8`, `double precision`, `money`, `character varying`, `varchar`, `character`, `char`, `text`, `citext`, `hstore`,
`bytea`, `bit`, `varbit`, `bit varying`, `timetz`, `timestamptz`, `timestamp`, `timestamp without time zone`,
`timestamp with time zone`, `date`, `time`, `time without time zone`, `time with time zone`, `interval`, `bool`,
`boolean`, `enum`, `point`, `line`, `lseg`, `box`, `path`, `polygon`, `circle`, `cidr`, `inet`, `macaddr`, `tsvector`,
`tsquery`, `uuid`, `xml`, `json`, `jsonb`, `int4range`, `int8range`, `numrange`, `tsrange`, `tstzrange`, `daterange`,
`geometry`, `geography`, `cube`, `ltree`

### `enum` column type

`enum` column type is supported by `spinosaurus` even thowgh `MySql` and `PostgresSQL` have their own definitions. There
are various possible column definitions:

Using typescript enums:

```typescript
export enum UserRole {
  ADMIN = "admin",
  EDITOR = "editor",
  GHOST = "ghost",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: UserRole.GHOST })
  role: UserRole;
}
```

> Note: String, numeric and heterogeneous enums are supported.

Using array with enum values:

```typescript
export type UserRoleType = "admin" | "editor" | "ghost",

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: "ghost" })
    role: UserRoleType
}
```

### Columns with generated values

You can create column with generated value using `@Generated` decorator. For example:

```typescript
@Entity()
export class User {
  @PrimaryColumn()
  id: number;

  @Column({ autoIncrement: "uuid" })
  uuid: string;
}
```

`uuid` value will be automatically generated and stored into the database.

Besides "uuid" there is also "increment" generated types, however there are some limitations on some database platforms
with this type of generation (for example some databases can only have one increment column, or some of them require
increment to be a primary key).

## Column options

Column options defines additional options for your entity columns. You can specify column options on

```typescript
export class User {
  @Column({ type: "varchar", length: 150, unique: true })
  name!: string;
}
```

List of available options in `ColumnOptions`:

- `spitype?: ColumnType` - Column type. One of the supported column types.
- `name?: string` - Column name in the database table. By default the column name is generated from the name of the
  property. You can change it by specifying your own name.
- `length?: string | number` - Column type's length. For example, if you want to create varchar(150) type you specify
  column type and length options.
- `nullable?: boolean` - Makes column NULL or NOT NULL in the database. By default column is nullable: false.
- `select?: boolean` - Defines whether or not to hide this column by default when making queries. When set to false, the
  column data will not show with a standard query. By default column is select: true
- `insert?: boolean` - Indicates if column value is set the first time you insert the object. Default value is true.
- `update?: boolean` - Indicates if column value is updated by "execute" operation. If false, you'll be able to write
  this value only when you first time insert the object. Default value is true.
- `default?: DefaultType | Function` - Adds database-level column's DEFAULT value.
- `comment?: string` - Database's column comment. Not supported by all database types.
- `precision?: number` - The precision for a decimal (exact numeric) column (applies only for decimal column), which is
  the maximum number of digits that are stored for the values. Used in some column types.
- `scale?: number` - The scale for a decimal (exact numeric) column (applies only for decimal column), which represents
  the number of digits to the right of the decimal point and must not be greater than precision. Used in some column
  types.
- `uniqueOne?: boolean` - Indicates if the column will have individual unique key.
- `unique?: boolean` - Indicates if the column will add a column to a table unique key.

## Entity inheritance

You can reduce duplication in your code by using entity inheritance.

For example, you have `Photo`, `Question`, `Post` entities:

```typescript
@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  size: string;
}

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  answersCount: number;
}

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  viewCount: number;
}
```

As you can see all those entities have common columns: `id`, `title`, `description`. To reduce duplication and produce a
better abstraction we can create a base class called `Content` for them:

```typescript
export abstract class Content {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;
}

@Entity()
export class Photo extends Content {
  @Column()
  size: string;
}

@Entity()
export class Question extends Content {
  @Column()
  answersCount: number;
}

@Entity()
export class Post extends Content {
  @Column()
  viewCount: number;
}
```

All columns (relations, embeds, etc.) from parent entities (parent can extend other entity as well) will be inherited
and created in final entities.

### Adjacency list

Adjacency list is a simple model with self-referencing. Benefit of this approach is simplicity, drawback is you can't
load a big tree at once because of join limitations. Example:

```typescript
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "https://deno.land/x/spinosaurus/mod.ts";

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToOne({}, { name: "parentCategory_ID", nullable: true })
  parentCategory?: Category;
}
```
