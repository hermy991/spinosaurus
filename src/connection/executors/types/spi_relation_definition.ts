import { OnDeleteType } from "../../../decorators/options/on_delete_type.ts";
import { OnUpdateType } from "../../../decorators/options/on_update_type.ts";
/**
 * Describes all relation's options.
 */
export type SpiRelationDefinition = {
  // entity: string;
  // schema?: string;
  name?: string;
  onDelete?: OnDeleteType;
  onUpdate?: OnUpdateType;
  columns: Array<string>;
  parentSchema?: string;
  parentEntity: string;
  parentColumns?: Array<string>;
};
