import {stringify, clearNames} from "../../tools/sql.ts"
import {BaseBuilding} from "../../base_building.ts";
import {DefColumn} from "../../def/def_column.ts";

export class AlterBuilding extends BaseBuilding {
  
  private fromData: [string, string?] | undefined = undefined;
  private columnsData: Array<[string, DefColumn]> = [];

  constructor(public conf : { delimiters: [string, string?]} = { delimiters: [`"`]}){
    super(conf);
  }

  alter(from: {entity: string, schema?: string}): void {
    this.fromData = [`${from.entity}`, from.schema];
  }

  columns(... columns: Array<[string, DefColumn]>): void {
    this.columnsData = [];
    columns.forEach(x => { 
      this.addColumn(x);
    });
  }

  addColumn(column: [string, DefColumn]): void {
    this.columnsData.push(column);
  }

  getEntityQuery(): string {
    if(!this.fromData){
      return ``;
    }
    let [entity, schema] = this.fromData;
    let query = clearNames({ left: this.left, identifiers: [schema, entity], right: this.right })
    return `ALTER TABLE ${query}`;
  }
  
  getColumnsQuery(): string {
    if(!this.columnsData.length || !this.fromData){
      return ``;
    }
    let [entity, schema] = this.fromData;
    let querys: string[] = [];
    let ename = this.getEntityQuery();

    for(let i = 0; i < this.columnsData.length; i++){
      let [columnName, def] = this.columnsData[0];
      columnName = clearNames({ left: this.left, identifiers: columnName, right: this.right });
      let { type, name, length, nullable, defaul, comment, precision, scale } = def;
      if(type){
        let newType = `${type.toUpperCase()}`;
        if(precision){
          let psArr: (string|number)[] = [precision];
          scale ? psArr.push(scale) : undefined;
          length ? psArr.push(length) : undefined;
          newType += `(${psArr.join(", ")})`;
        }
        querys.push(`${ename} ALTER COLUMN ${columnName} TYPE ${newType}`);
      }
      if(name){
        querys.push(`${ename} RENAME COLUMN ${columnName} TO ${clearNames({ left: this.left, identifiers: name, right: this.right })}`);
      }
      if(nullable === false || nullable === true){
        querys.push(`${ename} ALTER COLUMN ${columnName} ${ nullable ? 'DROP' : 'SET' } NOT NULL`);
      }
      if('defaul' in def){
        querys.push(`${ename} ALTER COLUMN ${columnName} ${ defaul === null || defaul === undefined ? 'DROP DEFAULT' : 'SET DEFAULT ' + stringify(defaul) }`);
      }
      if("comment" in def){
        querys.push(`COMMENT ON COLUMN ${clearNames({ left: this.left, identifiers: [schema, entity, name || columnName], right: this.right })} IS ${ comment === null || comment === undefined ? 'NULL' : stringify(comment) }`);
      }
      /**
       * COLLATION
       * MYSQL
       *   ALTER TABLE <table_name> MODIFY <column_name> VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
       * SQL SERVER
       *   ALTER TABLE dbo.MyTable ALTER COLUMN CharCol VARCHAR(50) COLLATE Latin1_General_100_CI_AI_SC_UTF8
       * POSTGRES
       *   ALTER TABLE users ALTER COLUMN name TYPE character varying(255) COLLATE "en_US"
       */

    }
    return `${querys.join(';\n')}`;
  }

  getQuery(): string {
    let query = `${this.getColumnsQuery()}`;
    return query;
  }
}