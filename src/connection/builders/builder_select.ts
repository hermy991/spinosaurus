import { BuilderBase } from "./base/builder_base.ts";
import { ConnectionAll } from "../connection_type.ts";
import {
  ParamClauseRelation,
  ParamComplexClauseRelation,
  ParamComplexOptions,
} from "./params/param_select.ts";

export class BuilderSelect extends BuilderBase {
  #selectData: Array<{ column: string; as?: string }> = [];
  #fromData:
    | { entity: string; schema?: string; as?: string }
    | { entity: Function; as?: string }
    | null = null;
  #clauseData: Array<ParamComplexClauseRelation> = [];
  #whereData: Array<string> = [];
  #groupByData: Array<string> = [];
  #havingData: Array<string> = [];
  #orderByData: Array<{ column: string; direction?: string }> = [];
  #paramsData: ParamComplexOptions = {};

  /*FLAGS*/
  #distinct = false;

  constructor(public conn: ConnectionAll) {
    super(conn);
  }

  selectDistinct(...columns: Array<{ column: string; as?: string }>): void {
    this.#distinct = true;
    this.select(...columns);
  }

  select(...columns: Array<{ column: string; as?: string }>): void {
    this.#selectData = [];
    columns.forEach((x) => this.addSelect(x));
  }

  addSelect(req: { column: string; as?: string }): void {
    this.#selectData.push(req);
  }

  from(
    req:
      | { entity: string; schema?: string; as?: string }
      | { entity: Function; as?: string }
      | Function,
  ): void {
    if (typeof req === "function") {
      this.#fromData = { entity: req };
    } else {
      this.#fromData = req;
    }
  }

  join(req: ParamClauseRelation, params?: ParamComplexOptions): void {
    this.#clauseData.push({ ...req, select: false, join: "inner" });
    if (params) {
      this.addParams(params);
    }
  }

  joinAndSelect(req: ParamClauseRelation, params?: ParamComplexOptions): void {
    this.#clauseData.push({ ...req, select: true, join: "inner" });
    if (params) {
      this.addParams(params);
    }
  }

  left(req: ParamClauseRelation, params?: ParamComplexOptions): void {
    this.#clauseData.push({ ...req, select: false, join: "left" });
    if (params) {
      this.addParams(params);
    }
  }

  leftAndSelect(req: ParamClauseRelation, params?: ParamComplexOptions): void {
    this.#clauseData.push({ ...req, select: true, join: "left" });
    if (params) {
      this.addParams(params);
    }
  }

  right(req: ParamClauseRelation, params?: ParamComplexOptions): void {
    this.#clauseData.push({ ...req, select: false, join: "right" });
    if (params) {
      this.addParams(params);
    }
  }

  rightAndSelect(req: ParamClauseRelation, params?: ParamComplexOptions): void {
    this.#clauseData.push({ ...req, select: true, join: "right" });
    if (params) {
      this.addParams(params);
    }
  }

  where(
    conditions: [string, ...string[]] | string,
    params?: ParamComplexOptions,
  ) {
    this.#whereData = [];
    this.addWhere(conditions, params);
  }

  andWhere(
    conditions: [string, ...string[]] | string,
    params?: ParamComplexOptions,
  ) {
    let tconditions = self.structuredClone(conditions);
    if (Array.isArray(tconditions)) {
      for (let i = 0; i < tconditions.length; i++) {
        tconditions[i] = `AND ${tconditions[i]}`;
      }
    } else tconditions = `AND ${tconditions}`;
    this.addWhere(tconditions, params);
  }

  orWhere(
    conditions: [string, ...string[]] | string,
    params?: ParamComplexOptions,
  ) {
    let tconditions = self.structuredClone(conditions);
    if (Array.isArray(tconditions)) {
      for (let i = 0; i < tconditions.length; i++) {
        tconditions[i] = `OR ${tconditions[i]}`;
      }
    } else tconditions = `OR ${tconditions}`;
    this.addWhere(tconditions, params);
  }

  addWhere(
    conditions: [string, ...string[]] | string,
    params?: ParamComplexOptions,
  ) {
    this.#whereData.push(
      ...(Array.isArray(conditions) ? conditions : [conditions]),
    );
    if (params) {
      this.addParams(params);
    }
  }

  groupBy(columns: [string, ...string[]] | string) {
    this.addGroupBy(columns);
  }

  addGroupBy(columns: [string, ...string[]] | string) {
    const tcolumns = Array.isArray(columns) ? columns : [columns];
    tcolumns.forEach((x) => this.#groupByData.push(x));
  }

  having(
    conditions: [string, ...string[]] | string,
    params?: ParamComplexOptions,
  ) {
    this.#havingData = [];
    this.addHaving(conditions, params);
  }

  andHaving(
    conditions: [string, ...string[]] | string,
    params?: ParamComplexOptions,
  ) {
    let tconditions = self.structuredClone(conditions);
    if (Array.isArray(tconditions)) {
      for (let i = 0; i < tconditions.length; i++) {
        tconditions[i] = `AND ${tconditions[i]}`;
      }
    } else tconditions = `AND ${tconditions}`;
    this.addHaving(tconditions, params);
  }

  orHaving(
    conditions: [string, ...string[]] | string,
    params?: ParamComplexOptions,
  ) {
    let tconditions = self.structuredClone(conditions);
    if (Array.isArray(tconditions)) {
      for (let i = 0; i < tconditions.length; i++) {
        tconditions[i] = `OR ${tconditions[i]}`;
      }
    } else tconditions = `OR ${tconditions}`;
    this.addHaving(tconditions, params);
  }

  addHaving(
    conditions: [string, ...string[]] | string,
    params?: ParamComplexOptions,
  ) {
    this.#havingData.push(
      ...(Array.isArray(conditions) ? conditions : [conditions]),
    );
    if (params) {
      this.addParams(params);
    }
  }

  orderBy(...columns: Array<{ column: string; direction?: string }>): void {
    this.#orderByData = [];
    columns.forEach((x) => this.addOrderBy(x));
  }

  addOrderBy(...columns: Array<{ column: string; direction?: string }>): void {
    columns.forEach((x) => this.#orderByData.push(x));
  }

  params(options?: ParamComplexOptions): void {
    this.#paramsData = {};
    if (options) {
      this.addParams(options);
    }
  }

  addParams(options: ParamComplexOptions): void {
    this.#paramsData = { ...this.#paramsData, ...options };
  }

  getSelectQuery() {
    let sql = `SELECT${this.#distinct ? " DISTINCT" : ""} `;
    if (!this.#selectData.length && this.#fromData) {
      const { schema, entity, as } = <any> this.#fromData;
      if (entity instanceof Function) {
        const te = this.getEntityData(this.conn.options.name, entity);
        let t = this.clearNames([te.schema, te.entity]);
        if (as) {
          t = this.clearNames(as);
        }
        const cols = this.getColumns(this.conn.options.name, entity);
        sql += cols.filter((x) => x.select).map((x) =>
          `${t}."${x.name}" "${x.name}"`
        )
          .join(", ");
      } else {
        let t = this.clearNames([schema, entity]);
        if (as) {
          t = this.clearNames(as);
        }
        sql += `${t}.*`;
      }

      if (this.#clauseData) {
        for (let i = 0; i < this.#clauseData.length; i++) {
          const { select, entity, schema, as } = <any> this.#clauseData[i];
          if (!select) {
            continue;
          }
          if (entity instanceof Function) {
            const te = this.getEntityData(this.conn.options.name, entity);
            let t = this.clearNames([te.schema, te.entity]);
            if (as) {
              t = this.clearNames(as);
            }
            // column list
            const cols = this.getColumns(this.conn.options.name, entity);
            sql += ", " +
              cols.filter((x) => x.select).map((x) =>
                `${t}."${x.name}" "${t.replaceAll(`"`, "")}.${x.name}"`
              )
                .join(", ");
          } else {
            let t = this.clearNames([schema, entity]);
            if (as) {
              t = this.clearNames(as);
            }
            sql += `, ${t}.*`;
          }
        }
      }
    } else {
      const columns: string[] = [];
      for (let i = 0; i < this.#selectData.length; i++) {
        const { column, as } = this.#selectData[i];
        const tempCol = `${column}` +
          (as ? ` AS ${this.clearNames(as)}` : "");
        columns.push(tempCol);
      }
      sql += `${columns.join(", ")}`;
    }
    return sql;
  }

  getFromQuery() {
    if (!this.#fromData) {
      return ``;
    }
    const { as } = this.#fromData;
    let te: { schema?: string; entity?: string } = {};
    if (this.#fromData.entity instanceof Function) {
      te = this.getEntityData(this.conn.options.name, this.#fromData.entity);
    } else {
      te = <any> this.#fromData;
    }
    let query = `${this.clearNames([te.schema, te.entity])}`;
    if (as) {
      query = `${query} AS ${this.clearNames([as])}`;
    }
    const sql = `FROM ${query}`;
    return sql;
  }

  getClauseQuery() {
    if (!this.#clauseData.length) {
      return ``;
    }
    const sqls: string[] = [];
    for (let i = 0; i < this.#clauseData.length; i++) {
      const { join, entity, as, on } = this.#clauseData[i];
      let te: { schema?: string; entity?: string } = <any> this.#clauseData[i];
      if (entity instanceof Function) {
        te = this.getEntityData(this.conn.options.name, entity);
      }
      const t = `${this.clearNames([te.schema, te.entity])}`;
      const ton = this.conn.interpolate(on, this.#paramsData);
      sqls.push(
        `${join.toUpperCase()} JOIN ${t}${
          as ? " AS " + this.clearNames(as) : ""
        } ON ${ton.join(" ")}`,
      );
    }
    return sqls.join(" ");
  }

  getWhereQuery() {
    if (!this.#whereData.length) {
      return ``;
    }
    const conditions: string[] = this.conn.interpolate(
      <[string, ...string[]]> this.#whereData,
      this.#paramsData,
    );
    return `WHERE ${conditions.join(" ")}`;
  }

  getGroupByQuery() {
    if (!this.#groupByData.length) {
      return ``;
    }
    const groups: string[] = [];
    for (let i = 0; i < this.#groupByData.length; i++) {
      const column = this.#groupByData[i];
      groups.push(column);
    }
    return `GROUP BY ${groups.join(", ")}`;
  }

  getHavingQuery() {
    if (!this.#havingData.length) {
      return ``;
    }
    const conditions: string[] = this.conn.interpolate(
      <[string, ...string[]]> this.#havingData,
      this.#paramsData,
    );
    return `HAVING ${conditions.join(" ")}`;
  }

  getOrderByQuery() {
    if (!this.#orderByData.length) {
      return ``;
    }
    const orders: string[] = [];
    for (let i = 0; i < this.#orderByData.length; i++) {
      const { column, direction } = this.#orderByData[i];
      const tempOrder = `${column}` +
        (direction ? " " + direction.toUpperCase() : "");
      orders.push(tempOrder);
    }
    return `ORDER BY ${orders.join(", ")}`;
  }

  getSql() {
    let query = `${this.getSelectQuery()}\n${this.getFromQuery()}`;
    if (this.#clauseData.length) {
      query += `\n${this.getClauseQuery()}`;
    }
    if (this.#whereData.length) {
      query += `\n${this.getWhereQuery()}`;
    }
    if (this.#groupByData.length) {
      query += `\n${this.getGroupByQuery()}`;
    }
    if (this.#havingData.length) {
      query += `\n${this.getHavingQuery()}`;
    }
    if (this.#orderByData.length) {
      query += `\n${this.getOrderByQuery()}`;
    }
    return query;
  }
}
