import { clearNames } from "../../tools/sql.ts";
import { SpiAllColumnDefinition } from "../../../connection/executors/types/spi_all_column_definition.ts";
import { SpiUniqueDefinition } from "../../../connection/executors/types/spi_unique_definition.ts";
import { BaseBuilding } from "../../base_building.ts";
import { InsertBuilding } from "../../dml/insert/insert_building.ts";
import { _ } from "../../../../deps.ts";

export class CreateBuilding extends BaseBuilding {
  #nameData:
    | { entity: string; schema?: string }
    | { schema: string; check?: boolean }
    | null = null;
  #columnsData: Array<SpiAllColumnDefinition> = [];
  #uniquesData: Array<{ name?: string; columnNames: Array<string> }> = [];
  #valuesData: Array<any> = [];
  constructor(
    public conf: { delimiters: [string, string?] } = { delimiters: [`"`] },
    public transformer: {
      createSchema?: Function;
      columnDefinition?: Function;
    } = {},
  ) {
    super(conf);
  }

  create(
    req: { entity: string; schema?: string } | {
      schema: string;
      check?: boolean;
    },
  ): void {
    this.#nameData = req;
  }

  columns(...columns: Array<SpiAllColumnDefinition>): void {
    this.#columnsData = [];
    columns.forEach((x) => {
      this.addColumn(x);
    });
  }

  addColumn(column: SpiAllColumnDefinition): void {
    column.columnName = `${column.columnName}`;
    this.#columnsData.push(column);
  }

  uniques(
    ...uniques: Array<SpiUniqueDefinition>
  ): void {
    this.#uniquesData = [];
    uniques.forEach((x) => {
      this.addUnique(x);
    });
  }

  addUnique(unique: SpiUniqueDefinition): void {
    this.#uniquesData.push(unique);
  }

  data(data: Array<any> | any) {
    this.addData(data);
  }

  addData(data: Array<any> | any) {
    data = Array.isArray(data) ? data : [data];
    this.#valuesData.push(...data);
  }

  getCreateSchemaQuery() {
    if (!this.#nameData) {
      return ``;
    }

    if (this.transformer.createSchema) {
      const nameData = _.cloneDeep(this.#nameData);
      nameData.schema = clearNames({
        left: this.left,
        identifiers: nameData.schema,
        right: this.right,
      });
      return this.transformer.createSchema(nameData);
    }
    return "";
  }

  getCreateTableQuery() {
    if (!this.#nameData) {
      return ``;
    }
    let entity = undefined;
    if ("entity" in this.#nameData) {
      entity = this.#nameData.entity;
    }
    const schema = this.#nameData.schema;
    let query = `${
      clearNames({ left: this.left, identifiers: entity, right: this.right })
    }`;
    if (schema) {
      query = `${
        clearNames({
          left: this.left,
          identifiers: [schema, entity],
          right: this.right,
        })
      }`;
    }
    return `CREATE TABLE ${query}`;
  }

  getColumnsQuery() {
    if (!this.#columnsData.length) {
      return ``;
    }
    const sqls: string[] = [];
    for (let i = 0; i < this.#columnsData.length; i++) {
      let sql = "";
      let columnName = `${this.#columnsData[i].columnName}`.replace(
        /["]/ig,
        "",
      );
      columnName = `${
        clearNames({
          left: this.left,
          identifiers: columnName,
          right: this.right,
        })
      }`;
      if (this.transformer.columnDefinition) {
        sql = this.transformer.columnDefinition({
          ...this.#columnsData[i],
          columnName,
        });
      }
      sqls.push(sql);
    }
    return `( ${sqls.join(", ")} )`;
  }

  getInsertsQuery() {
    if (!this.#nameData) {
      return ``;
    }
    if (!("entity" in this.#nameData)) {
      return ``;
    }
    const ib = new InsertBuilding(this.conf, this.transformer);
    ib.insert(this.#nameData);
    ib.values(this.#valuesData);
    return ib.getQuery();
  }

  getQuery() {
    if (!this.#nameData) {
      return "";
    }
    if (!("entity" in this.#nameData)) {
      return `${this.getCreateSchemaQuery()}`;
    }
    let query = `${this.getCreateTableQuery()}\n${this.getColumnsQuery()}`;
    if (this.#valuesData.length) {
      query += `;\n${this.getInsertsQuery()}`;
    }
    return query;
  }
}
