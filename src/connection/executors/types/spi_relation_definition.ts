import { OnDeleteType } from "../../../decorators/options/on_delete_type.ts";
import { OnUpdateType } from "../../../decorators/options/on_update_type.ts";
/**
 * Describes all relation's options.
 */
export type SpiRelationEntityDefinition = {
  name?: string;
  onDelete?: OnDeleteType;
  onUpdate?: OnUpdateType;
  columns: Array<string>;
  parentEntity: Function;
  parentColumns?: Array<string>;
};
export type SpiRelationNoEntityDefinition = {
  name?: string;
  onDelete?: OnDeleteType;
  onUpdate?: OnUpdateType;
  columns: Array<string>;
  parentSchema?: string;
  parentEntity: string;
  parentColumns?: Array<string>;
};
export type SpiRelationDefinition =
  | SpiRelationEntityDefinition
  | SpiRelationNoEntityDefinition;
