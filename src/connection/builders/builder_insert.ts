import { Logging } from "../loggings/logging.ts";
import { BuilderBase } from "./base/builder_base.ts";
import { ParamInsertEntity, ParamInsertOptions, ParamInsertValue } from "./params/param_insert.ts";
import { Driver } from "../connection_type.ts";
import { findColumn, findPrimaryColumn } from "../../stores/store.ts";

export class BuilderInsert<T> extends BuilderBase {
  #options: ParamInsertOptions = {
    autoInsert: true,
    autoGeneratePrimaryKey: true,
  };
  #entityData: { entity: string; schema?: string } | Function | null = null;
  #valuesData: ParamInsertValue<T>[] = [];

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
              let xc = findColumn({
                entityOrClass: <Function> e.classFunction,
                propertyKey: p.propertyKey,
                nameOrOptions: this.driver.options,
              });
              let fc = findPrimaryColumn({ entityOrClass: p.type, nameOrOptions: this.driver.options });
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
    for (const value of this.#valuesData) {
      const sql = `${this.getEntityValueQuery(e, value, ps)}`;
      if (sql) {
        sqls.push(sql);
      }
    }
    return sqls;
  }
}
