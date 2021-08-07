import { SpiAllColumnDefinition } from "../executors/types/spi_all_column_definition.ts";
import { SpiCheckDefinition } from "../executors/types/spi_check_definition.ts";
import { SpiUniqueDefinition } from "../executors/types/spi_unique_definition.ts";
import { ConnectionAll } from "../connection_type.ts";
import { BuilderBase } from "./base/builder_base.ts";
import { BuilderInsert } from "./builder_insert.ts";
import { _ } from "../../../deps.ts";

export class BuilderCreate extends BuilderBase {
  #nameData:
    | { entity: string; schema?: string }
    | { schema: string; check?: boolean }
    | null = null;
  #columnsData: Array<SpiAllColumnDefinition> = [];
  #checkData: Array<SpiCheckDefinition> = [];
  #uniquesData: Array<{ name?: string; columnNames: Array<string> }> = [];
  #valuesData: Array<any> = [];
  constructor(public conn: ConnectionAll) {
    super(conn);
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

  checks(...checks: Array<SpiCheckDefinition>): void {
    this.#checkData = [];
    checks.forEach((x) => {
      this.addCheck(x);
    });
  }

  addCheck(check: SpiCheckDefinition): void {
    this.#checkData.push(check);
  }

  uniques(...uniques: Array<SpiUniqueDefinition>): void {
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
    const nameData = _.cloneDeep(this.#nameData);
    nameData.schema = this.clearNames(nameData.schema);
    return this.conn.createSchema(nameData);
  }

  getCreateTableQuery() {
    if (!this.#nameData) {
      return ``;
    }
    let entity = undefined;
    if ("entity" in this.#nameData) {
      entity = this.#nameData.entity;
    }
    const { schema } = this.#nameData;
    let query = `${this.clearNames(entity)}`;
    if (schema) {
      query = `${this.clearNames([schema, entity])}`;
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
      const columnName = this.clearNames(this.#columnsData[i].columnName);
      sql = this.conn.columnDefinition({ ...this.#columnsData[i], columnName });
      sqls.push(sql);
    }
    return `( ${sqls.join(", ")} )`;
  }

  getChecksQuery() {
    if (!this.#checkData.length || !this.#nameData) {
      return ``;
    }
    const sqls: string[] = [];
    const schema = this.#nameData?.schema;
    let entity = undefined;
    if ("entity" in this.#nameData) {
      entity = this.#nameData.entity;
    }

    for (let i = 0; i < this.#checkData.length; i++) {
      let sql = "";
      const name = this.clearNames(
        this.#checkData[i].name ? this.#checkData[i].name : this.generateName1({
          prefix: "CHK",
          ...this.#nameData,
          sequence: i + 1,
        }),
      );
      sql = this.conn.createCheck({
        entity: this.clearNames([schema, entity]),
        ...this.#checkData[i],
        name,
      });
      sqls.push(sql);
    }
    return `${sqls.join("; ")}`;
  }

  getUniquesQuery() {
    if (!this.#uniquesData.length || !this.#nameData) {
      return ``;
    }
    const sqls: string[] = [];
    const schema = this.#nameData?.schema;
    let entity = undefined;
    if ("entity" in this.#nameData) {
      entity = this.#nameData.entity;
    }

    for (let i = 0; i < this.#uniquesData.length; i++) {
      let sql = "";
      const name = this.clearNames(
        this.#uniquesData[i].name
          ? this.#uniquesData[i].name
          : this.generateName1({
            prefix: "UQ",
            ...this.#nameData,
            sequence: i + 1,
          }),
      );
      sql = this.conn.createUnique({
        entity: this.clearNames([schema, entity]),
        ...this.#uniquesData[i],
        name,
      });
      sqls.push(sql);
    }
    return `${sqls.join("; ")}`;
  }

  getInsertsQuery() {
    if (!this.#nameData) {
      return ``;
    }
    if (!("entity" in this.#nameData)) {
      return ``;
    }
    const ib = new BuilderInsert(this.conn);
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
    if (this.#checkData.length) {
      query += `;\n${this.getChecksQuery()}`;
    }
    if (this.#uniquesData.length) {
      query += `;\n${this.getUniquesQuery()}`;
    }
    if (this.#valuesData.length) {
      query += `;\n${this.getInsertsQuery()}`;
    }
    return query;
  }
}
