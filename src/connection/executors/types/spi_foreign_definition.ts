import { OnDeleteType } from "../../../decorators/options/on_delete_type.ts";
import { OnUpdateType } from "../../../decorators/options/on_update_type.ts";
/**
 * Describes all relation's options.
 */
export type SpiForeignDefinition = {
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
};
