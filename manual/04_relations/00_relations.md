# Relations

- [What are relations](#what-are-relations)
- [Relation options](#relation-options)

## What are relations

Relations helps you to work with related entities easily. There are several types of relations:

- [one-to-one](./01_one_to_one_relations.md) using `@OneToOne`
- [many-to-one](./02_many_to_one_relations) using `@ManyToOne`

<!-- - [one-to-many](./many-to-one-one-to-many-relations.md) using `@OneToMany`
- [many-to-many](./many-to-many-relations.md) using `@ManyToMany` -->

## Relation options

There are several options you can specify for relations:

- `onDelete: "restrict"  | "cascade"  | "set null"  | "default"  | "no action"` - specifies how foreign key should
  behave when referenced object is deleted.
- `onUpdate: "restrict"  | "cascade"  | "set null"  | "default"  | "no action"` - specifies how foreign key should
  behave when referenced object is updated.
- `nullable: boolean` - Indicates whether this relation's column is nullable or not. By default it is nullable.
