import { ColumnType } from "../options/column_type.ts";
import { DefaultType } from "../options/default_type.ts";
import {
  OnDeleteType,
  OnUpdateType,
} from "../../connection/builders/params/param_relation.ts";
import { ParamData } from "../../connection/builders/params/param_data.ts";
import { ParamNext } from "../../connection/builders/params/param_next.ts";
import { ParamAfter } from "../../connection/builders/params/param_after.ts";

export type StoreSchema = {
  name: string;
};

export type StoreCheckOptions = {
  name?: string;
  expression: string;
};

export type StoreCheck = {
  target?: Function;
  options: StoreCheckOptions;
  mixeds: StoreCheckOptions;
};

export type StoreUniqueOptions = {
  name?: string;
  columns: [string, ...string[]];
};

export type StoreUnique = {
  target?: Function;
  options: StoreUniqueOptions;
  mixeds: StoreUniqueOptions;
};

export type StoreIndexOptions = {
  name?: string;
  columns: [string, ...string[]];
};

export type StoreIndex = {
  target: Function;
  options: StoreIndexOptions;
  mixeds: StoreIndexOptions;
};

export type StoreData = { target: Function; entries: ParamData[] };

export type StoreNext = { target: Function; steps: ParamNext[] };

export type StoreAfter = { target: Function; steps: ParamAfter[] };

export type StoreColumnOptions = {
  /**
   * Column type. One of the supported column types.
   */
  spitype?: ColumnType; //ColumnType -
  /**
    * Column name in the database table. By default the column name is generated from the name of the property. You can change it by specifying your own name.
    */
  name?: string;
  /**
    * Column type's length. For example, if you want to create varchar(150) type you specify column type and length options.
    */
  length?: string | number;
  /**
    * Makes column NULL or NOT NULL in the database. By default column is nullable: false.
    */
  nullable?: boolean;
  /**
    * Defines whether or not to hide this column by default when making queries. When set to false, the column data will not show with a standard query. By default column is select: true
    */
  select?: boolean;
  /**
    * Indicates if column value is set the first time you insert the object. Default value is true.
    */
  insert?: boolean;
  /**
    * Indicates if column value is updated by "execute" operation. If false, you'll be able to write this value only when you first time insert the object. Default value is true.
    */
  update?: boolean;
  /**
    * Adds database-level column's DEFAULT value.
    */
  default?: DefaultType | Function; // DefaultType
  /**
    * Database's column comment. Not supported by all database types.
    */
  comment?: string;
  /**
    * The precision for a decimal (exact numeric) column (applies only for decimal column), which is the maximum number of digits that are stored for the values. Used in some column types.
    */
  precision?: number;
  /**
    * The scale for a decimal (exact numeric) column (applies only for decimal column), which represents the number of digits to the right of the decimal point and must not be greater than precision. Used in some column types.
    */
  scale?: number;
  /**
    * Indicates if the column will have individual unique key.
    */
  uniqueOne?: boolean;
  /**
    * Indicates if the column will add a column to a table unique key.
    */
  unique?: boolean;
  /**
   * Option to specify when the column would by in auto auto increment
   */
  autoIncrement?: "increment" | "uuid";
  /**
   * Indicates if column would by in primary key
   */
  primary?: boolean;
  /**
   * In update time, when values is not set, then use this column to update
   */
  autoUpdate?: Function;
};

export type StoreRelation = {
  /**
   * Entity function o type
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

export type StoreColumn = {
  target: StoreColumnOptions;
  entity: any;
  descriptor: any;
  property: any;
  relation?: StoreRelation;
  options: StoreColumnOptions;
  mixeds: StoreColumnOptions;
};

export type StoreRelationColumn = {
  target?: StoreColumnOptions;
  entity: any;
  descriptor: any;
  property: any;
  relation: StoreRelation;
  options: StoreColumnOptions;
  mixeds: StoreColumnOptions;
};

export type StoreTableOptions = {
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

export type StoreTable = {
  target?: Function;
  options: StoreTableOptions;
  mixeds: StoreTableOptions;
  columns: StoreColumn[];
  checks: StoreCheck[];
  uniques: StoreUnique[];
  relations: StoreRelationColumn[];
  data: StoreData[];
  nexts: StoreNext[];
  afters: StoreAfter[];
};
export class MetadataStore {
  readonly tables: StoreTable[] = [];
  readonly schemas: StoreSchema[] = [];
  readonly checks: StoreCheck[] = [];
  readonly uniques: StoreUnique[] = [];
  readonly indixes: StoreIndex[] = [];
  readonly relations: StoreRelationColumn[] = [];
  readonly columns: StoreColumn[] = [];
  readonly data: StoreData[] = [];
  readonly nexts: StoreNext[] = [];
  readonly afters: StoreAfter[] = [];
}
