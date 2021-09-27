/**
 * Describes all entity's options.
 */
export type EntityOptions = {
  /**
   * Table name.
   * If not specified then naming strategy will generate table name from entity name.
   */
  name?: string;

  /**
   * Indicates if schema synchronization is enabled or disabled for this entity.
   * If it will be set to false then schema sync will and migrations ignore this entity.
   * By default schema synchronization is enabled for all entities.
   */
  database?: string;

  /**
   * Schema name. Used in Postgres and Sql Server.
   */
  schema?: string;

  /**
   * Indicates if schema synchronization is enabled or disabled for this entity.
   * If it will be set to false then schema sync will and migrations ignore this entity.
   * By default schema synchronization is enabled for all entities.
   */
  synchronize?: false;
};
