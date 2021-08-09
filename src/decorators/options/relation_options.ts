import { OnDeleteType } from "./on_delete_type.ts";
import { OnUpdateType } from "./on_update_type.ts";
/**
 * Describes all relation's options.
 */
export interface RelationOptions {
  /**
   * Entity function
   */
  entity?: Function;
  /**
   * Foreign key's name
   */
  name?: string;
  /**
   * Database cascade action on delete.
   */
  onDelete?: OnDeleteType;
  /**
   * Database cascade action on update.
   */
  onUpdate?: OnUpdateType;
}
