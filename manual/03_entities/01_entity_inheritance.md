# Entity Inheritance

- [Concrete Table Inheritance](#concrete-table-inheritance)

## Concrete Table Inheritance

You can reduce duplication in your code by using entity inheritance patterns. The simplest and the most effective is
concrete table inheritance.

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
```

```typescript
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
```

```typescript
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
```

```typescript
@Entity()
export class Photo extends Content {
  @Column()
  size: string;
}
```

```typescript
@Entity()
export class Question extends Content {
  @Column()
  answersCount: number;
}
```

```typescript
@Entity()
export class Post extends Content {
  @Column()
  viewCount: number;
}
```

All columns (relations, embeds, etc.) from parent entities (parent can extend other entity as well) will be inherited
and created in final entities.

This example will create 3 tables - `photo`, `question` and `post`.
