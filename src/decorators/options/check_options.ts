/**
 * Describes all columns's entity options.
 */
export interface CheckOptions {
  /**
   * Check name,
   */
  name?: string;
  /**
   * Column type's length. For example, if you want to create varchar(150) type you specify column type and length options.
   */
  expression: string;
}
