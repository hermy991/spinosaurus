/**
 * Creates a database check.
 * Can be used on entity property or on entity.
 * Can create checks with composite columns when used on entity.
 */
export type StoreUniqueOptions = {
  /**
   * Unique constraints name.
   * If not specified then naming strategy will generate unique constranint name from entity name and sequence.
   */
  name?: string;

  /**
   * columns to be evaluate on insert or update.
   */
  columns: [string, ...string[]];

  /**
   * Connection name where entitties will be store.
   */
  connectionName?: string;
};
