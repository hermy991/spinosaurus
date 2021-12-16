import { Logging } from "../loggings/logging.ts";
import { BuilderBase } from "./base/builder_base.ts";
import {
  ParamInsertEntity,
  ParamInsertOptions,
  ParamInsertReturning,
  ParamInsertValue,
} from "./params/param_insert.ts";
import { Driver } from "../connection_type.ts";
import { findColumn, findPrimaryColumn } from "../../stores/store.ts";

export class BuilderInsert<T> extends BuilderBase {
  #options: ParamInsertOptions = { autoInsert: true, autoGeneratePrimaryKey: true };
  #entityData: { entity: string; schema?: string } | Function | null = null;
  #valuesData: ParamInsertValue<T>[] = [];
  #returningData: Array<{ column: string; as?: string }> = [];

  constructor(public driver: Driver, public logging?: Logging) {
    super(driver, logging);
  }

  insert(req: ParamInsertEntity): void {
    if (Array.isArray(req)) {
      const [entity, schema] = req;
      this.#entityData = { entity, schema };
    } else if (typeof req === "function") {
      this.#entityData = req;
    } else if (req.entity instanceof Function) {
      this.#entityData = req.entity;
      this.#options = { ...this.#options, ...((<any> req).options || {}) };
    } else {
      this.#entityData = <any> req;
    }
  }

  values<T>(data: ParamInsertValue<T>[] | ParamInsertValue<T>) {
    this.#valuesData = [];
    this.addValues(data);
  }

  addValues<T>(data: ParamInsertValue<T>[] | ParamInsertValue<T>) {
    data = Array.isArray(data) ? data : [data];
    data.forEach((d) => this.#valuesData.push(<T> d));
  }

  returning(...clauses: Array<ParamInsertReturning>) {
    this.#returningData = [];
    clauses.forEach((x) => this.addReturning(x));
  }

  addReturning(...clauses: Array<ParamInsertReturning>) {
    const tempClauses: Array<{ column: string; as?: string }> = [];
    for (let i = 0; i < clauses.length; i++) {
      const tempClause = clauses[i];
      if (Array.isArray(tempClause)) {
        const [column, as] = (tempClause as [string, string?]);
        tempClauses.push({ column, as });
      } else if (typeof tempClause === "string") {
        tempClauses.push({ column: tempClause });
      } else {
        tempClauses.push(<any> tempClause);
      }
    }
    this.#returningData.push(...tempClauses);
  }

  getEntityQuery(e: { schema?: string; entity?: string }) {
    const query = `${this.clearNames([e.schema, e.entity])}`;
    return `INSERT INTO ${query}`;
  }

  getColumnsQuery(keys: Array<string>) {
    if (!this.#valuesData.length) {
      return ``;
    }
    const columns: Set<string> = new Set();
    keys.forEach((key) => columns.add(this.clearNames(key)));
    return `(${[...columns].join(", ")})`;
  }
  getValuesQuery<T>(values: Array<ParamInsertValue<T>>) {
    return `VALUES (${values.map((v) => this.driver.stringify(<any> v)).join(", ")})`;
  }

  getEntityValueQuery<T>(
    e: { schema?: string; entity?: string; classFunction?: Function },
    value: ParamInsertValue<T>,
    ps: Array<any> = [],
  ): string {
    if (!value) {
      return ``;
    }
    let primaryGeneratedColumn: { name: string; value: any; autoIncrement: string } | undefined;
    const sqls: string[] = [this.getEntityQuery(e)];
    let cloned: ParamInsertValue<T> = {};
    const { autoInsert, autoGeneratePrimaryKey } = this.#options;
    if (!ps.length) {
      cloned = value;
    } else {
      for (const name in value) {
        for (const p of ps) {
          if (p.propertyKey === name) {
            if (
              p.insert && typeof (<any> value)[name] === "object" && !((<any> value)[name] instanceof Date) &&
              (<any> value)[name] !== null &&
              !Array.isArray((<any> value)[name])
            ) {
              const xc = findColumn({
                entityOrClass: <Function> e.classFunction,
                propertyKey: p.propertyKey,
                nameOrOptions: this.driver.options,
              });
              const fc = findPrimaryColumn({ entityOrClass: p.type, nameOrOptions: this.driver.options });
              if (xc && xc.length === 2 && fc && fc.length === 2 && fc[1].propertyKey in (<any> value)[name]) {
                (<any> cloned)[xc[1].foreign.columnName] = (<any> (<any> value)[name])[fc[1].propertyKey];
              }
            } else if (p.insert || (p.primary && p.autoIncrement && !autoGeneratePrimaryKey)) {
              (<any> cloned)[p.name] = (<any> value)[name];
            }
            if (p.primary && p.autoIncrement) {
              primaryGeneratedColumn = {
                name: p.name,
                value: (<any> value)[name],
                autoIncrement: p.autoIncrement,
              };
            }
          }
        }
      }
      if (primaryGeneratedColumn && autoGeneratePrimaryKey) {
        return ``;
      }
      for (const p of ps.filter((x) => x.autoInsert && autoInsert)) {
        if (!(p.name in cloned)) {
          (<any> cloned)[p.name] = p.autoInsert;
        }
      }
    }
    if (!Object.keys(cloned).length) {
      return ``;
    }
    Object.values(cloned);
    sqls.push(this.getColumnsQuery(Object.keys(cloned)));
    sqls.push(this.getValuesQuery(<any> Object.values(cloned)));
    return sqls.join(" ");
  }
  getReturningQuery(
    e: { schema?: string; entity?: string; classFunction?: Function },
    rs: Array<{ column: string; as?: string }> = [],
    ps: Array<any> = [],
  ): string {
    if (!rs.length) {
      if (e.classFunction instanceof Function) {
        ps.filter((x) => x.primary).forEach((x) => rs.push({ column: this.clearNames(x.name) }));
      } else {
        rs.push({ column: "*" });
      }
    }
    let sql = `RETURNING `;
    if (rs.length && e) {
      sql += rs.map((x) => x.column + (x.as ? " AS " + this.clearNames(x.as) : "")).join(", ");
      return sql;
    } else {
      return "";
    }
  }
  setPrimaryKeys(values: Record<string, any>[] = []) {
    if (!this.#entityData) {
      return;
    }
    let e: { schema?: string; entity?: string; classFunction?: Function } = {};
    let ps = [];
    if (this.#entityData instanceof Function) {
      e = this.getEntityData(this.driver.options.name, this.#entityData);
      e.classFunction = this.#entityData;
      ps = this.getColumns(this.driver.options.name, this.#entityData);
    } else {
      e = this.#entityData;
    }
    const primaryKeyColumns = ps.filter((x) => x.primary);
    for (let i = 0; i < values.length && values.length === this.#valuesData.length; i++) {
      for (let y = 0; y < primaryKeyColumns.length; y++) {
        const value2 = values[i];
        const primaryKeyColumn = primaryKeyColumns[y];
        if (primaryKeyColumn.name in value2) {
          const value1 = this.#valuesData[i];
          (<any> value1)[primaryKeyColumn.name] = value2[primaryKeyColumn.name];
        }
      }
    }
  }
  getSqls(): string[] {
    if (!this.#entityData) {
      return [];
    }
    const sqls: string[] = [];
    let e: { schema?: string; entity?: string; classFunction?: Function } = {};
    let ps = [];
    if (this.#entityData instanceof Function) {
      e = this.getEntityData(this.driver.options.name, this.#entityData);
      e.classFunction = this.#entityData;
      ps = this.getColumns(this.driver.options.name, this.#entityData);
    } else {
      e = this.#entityData;
    }
    const rs: Array<{ column: string; as?: string }> = JSON.parse(JSON.stringify(this.#returningData));
    for (const value of this.#valuesData) {
      let sql = this.getEntityValueQuery(e, value, ps);
      const sqlReturning = this.getReturningQuery(e, rs, ps);
      if (sql && sqlReturning) {
        sql = `${sql} ${sqlReturning}`;
      }
      if (sql) {
        sqls.push(sql);
      }
    }
    return sqls;
  }
}
