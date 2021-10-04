/**
 * Creates a database check.
 * Can be used on entity property or on entity.
 * Can create checks with composite columns when used on entity.
 */
export type StoreCheckOptions = {
  /**
   * Check name.
   * If not specified then naming strategy will generate check name from entity name and sequence.
   */
  name?: string;

  /**
   * Expression to be evaluate on insert or update.
   */
  expression: string;

  /**
   * Connection name where entitties will be store.
   */
  connectionName?: string;
};
