import { Driver } from "../connection_type.ts";
import { BuilderSelect } from "../builders/builder_select.ts";
import { ParamFromOptions } from "../builders/params/param_select.ts";
import { ParamClauseOptions, ParamComplexValues } from "../builders/params/param_select.ts";

export class ExecutorSelect {
  sb: BuilderSelect = new BuilderSelect(<Driver> {});

  #managingFromParams(
    // deno-lint-ignore camelcase
    entity_entityName_subQuery_fromOption: Function | string | ExecutorSelect | ParamFromOptions,
    // deno-lint-ignore camelcase
    maybe_as?: string,
  ): any {
    if (typeof entity_entityName_subQuery_fromOption === "function") {
      // from(entity: Function): this;
      // from(entity: Function, as: string): this;
      return { entity: entity_entityName_subQuery_fromOption, as: maybe_as };
    } else if (typeof entity_entityName_subQuery_fromOption === "string") {
      // from(entityName: string): this;
      // from(entityName: string, as: string): this;
      return { entity: entity_entityName_subQuery_fromOption, as: maybe_as };
    } else if (entity_entityName_subQuery_fromOption instanceof ExecutorSelect) {
      // from(entityName: ExecutorSelect): this;
      // from(entityName: ExecutorSelect, as: string): this;
      return { entity: entity_entityName_subQuery_fromOption, as: maybe_as };
    } else if (typeof entity_entityName_subQuery_fromOption === "object") {
      // from(fromOption: ParamFromEntity): this;
      return entity_entityName_subQuery_fromOption;
    }
  }

  #managingJoinParams(
    // deno-lint-ignore camelcase
    entity_entityName_subQuery_clauseOption: Function | string | ExecutorSelect | ParamClauseOptions,
    // deno-lint-ignore camelcase
    maybe_on_params_as?: string | ParamComplexValues,
    // deno-lint-ignore camelcase
    maybe_params_on?: ParamComplexValues | string,
    // deno-lint-ignore camelcase
    meybe_params?: ParamComplexValues,
  ): { e: any; params?: any } {
    let e;
    let params;
    if (typeof entity_entityName_subQuery_clauseOption === "function") {
      // join(entity: Function, as: string, on: string): this;
      // join(entity: Function, as: string, on: string, params: ParamComplexValues): this;
      if (typeof maybe_on_params_as === "string" && typeof maybe_params_on === "string") {
        e = { entity: entity_entityName_subQuery_clauseOption, as: maybe_on_params_as, on: maybe_params_on };
        params = meybe_params;
      } // join(entity: Function, on: string, params: ParamComplexValues): this;
      else if (typeof maybe_on_params_as === "string" && typeof maybe_params_on === "object") {
        e = { entity: entity_entityName_subQuery_clauseOption, on: maybe_on_params_as };
        params = maybe_params_on;
      } // join(entity: Function, on: string): this;
      else if (typeof maybe_on_params_as === "string") {
        e = { entity: entity_entityName_subQuery_clauseOption, on: maybe_on_params_as };
      }
    } else if (typeof entity_entityName_subQuery_clauseOption === "string") {
      // join(entityName: string, as: string, on: string): this;
      // join(entityName: string, as: string, on: string, params: ParamComplexValues): this;
      if (typeof maybe_on_params_as === "string" && typeof maybe_params_on === "string") {
        e = { entity: entity_entityName_subQuery_clauseOption, as: maybe_on_params_as, on: maybe_params_on };
        params = meybe_params;
      } // join(entityName: string, on: string, params: ParamComplexValues): this;
      else if (typeof maybe_on_params_as === "string" && typeof maybe_params_on === "object") {
        e = { entity: entity_entityName_subQuery_clauseOption, on: maybe_on_params_as };
        params = maybe_params_on;
      } // join(entityName: string, on: string): this;
      else if (typeof maybe_on_params_as === "string") {
        e = { entity: entity_entityName_subQuery_clauseOption, on: maybe_on_params_as };
      }
    } else if (entity_entityName_subQuery_clauseOption instanceof ExecutorSelect) {
      // join(subQuery: ExecutorSelect, as: string, on: string): this;
      // join(subQuery: ExecutorSelect, as: string, on: string, params: ParamComplexValues): this;
      if (typeof maybe_on_params_as === "string" && typeof maybe_params_on === "string") {
        e = { entity: entity_entityName_subQuery_clauseOption, as: maybe_on_params_as, on: maybe_params_on };
        params = meybe_params;
      } // join(subQuery: ExecutorSelect, on: string, params: ParamComplexValues): this;
      else if (typeof maybe_on_params_as === "string" && typeof maybe_params_on === "object") {
        e = { entity: entity_entityName_subQuery_clauseOption, on: maybe_on_params_as };
        params = maybe_params_on;
      } // join(subQuery: ExecutorSelect, on: string): this;
      else if (typeof maybe_on_params_as === "string") {
        e = { entity: entity_entityName_subQuery_clauseOption, on: maybe_on_params_as };
      }
    } else if (typeof entity_entityName_subQuery_clauseOption === "object") {
      // join(clauseOption: ParamClauseRelation, params?: ParamComplexValues): this;
      if (typeof maybe_on_params_as === "object") {
        e = entity_entityName_subQuery_clauseOption;
        params = maybe_on_params_as;
      } // join(clauseOption: ParamClauseRelation): this;
      else {
        e = entity_entityName_subQuery_clauseOption;
      }
    }
    return { e, params };
  }

  constructor(public driver: Driver, public transaction: any) {
    this.sb = new BuilderSelect(driver);
  }

  /** DML SQL Operation*/
  select(...columns: Array<{ column: string; as?: string } | [string, string?]>): this {
    this.sb.select(...columns);
    return this;
  }

  selectDistinct(...columns: Array<{ column: string; as?: string } | [string, string?]>): this {
    this.sb.selectDistinct(...columns);
    return this;
  }

  addSelect(...columns: Array<{ column: string; as?: string } | [string, string?]>): this {
    this.sb.addSelect(...columns);
    return this;
  }

  /**
   * The SQL FROM clause is used to list the entity.
   *
   * @param {Function} entity Entity class
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... let qb = db.from(SelectEntity1);
   * ```
   */
  from(entity: Function): this;

  /**
   * The SQL FROM clause is used to list the entity.
   *
   * @param {Function} entity Entity class
   * @param {string} as Param is used to rename a entity with an alias.
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... let qb = db.from(SelectEntity1, "u");
   * ```
   */
  from(entity: Function, as: string): this;

  /**
   * The SQL FROM clause is used to list the entity.
   *
   * @param {string} entityName Entity class name
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... let qb = db.from("User");
   * ```
   */
  from(entityName: string): this;

  /**
   * The SQL FROM clause is used to list the entity.
   *
   * @param {string} entityName Entity class name, use a period to specify a squema like `schema.Entity`
   * @param {string} as Param is used to rename a entity with an alias.
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... let qb = db.from("User", "u");
   * ```
   */
  from(entityName: string, as: string): this;

  /**
   * The SQL FROM clause is used to list the entity or sub-query.
   *
   * @param {ExecutorSelect} subQuery Another ExecutorSelect
   * @param {string} as Param is used to rename a sub-query with an alias.
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... let qb = db.from(db.from(User));
   * ```
   * - Result query
   * ```sql
   *  ... SELECT * FROM ( SELECT * FROM "User" )
   * ```
   */
  from(subQuery: ExecutorSelect): this;

  /**
   * The SQL FROM clause is used to list the entity or sub-query.
   *
   * @param {ExecutorSelect} subQuery Another ExecutorSelect
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... let qb = db.from(db.from(User), "u");
   * ```
   * - Result query
   * ```sql
   *  ... SELECT "u".* FROM ( SELECT * FROM "User" ) AS "u"
   * ```
   */
  from(subQuery: ExecutorSelect, as: string): this;

  /**
   * The SQL FROM clause is used to list the entity.
   *
   * @param {string} fromOption From option
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... let qb = db.from({ entity: User, as: "u"});
   *  ... let qb = db.from({ schema: "hello", entity: "User", as: "u"});
   * ```
   */
  from(fromOption: ParamFromOptions): this;

  /**
   * Base function
   */
  from(
    // deno-lint-ignore camelcase
    entity_entityName_subQuery_fromOption: Function | string | ExecutorSelect | ParamFromOptions,
    // deno-lint-ignore camelcase
    maybe_as?: string,
  ): this {
    const r = this.#managingFromParams(entity_entityName_subQuery_fromOption, maybe_as);
    this.sb.from(r);
    return this;
  }

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {Function} entity Next entity
   * @param {string} on Join condition
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .join(FromEntity2, `"FromEntity2"."columnKey1" = "u1"."columnKey1"`);
   * ```
   */
  join(entity: Function, on: string): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {Function} entity Next entity
   * @param {string} on Join condition
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *   ... .join(FromEntity2, `"FromEntity2"."columnKey1" = "u1"."columnKey1" AND "u1"."columnKey1" = :key`, { key: "xx" });
   * ```
   */
  join(entity: Function, on: string, params: ParamComplexValues): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {Function} entity: Function = next entity
   * @param {string} as: string = entity alias
   * @param {string} on: string = join condition
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .join(FromEntity2, "u", `"u"."columnKey1" = "u1"."columnKey1"`);
   * ```
   */
  join(entity: Function, as: string, on: string): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {Function} entity Next entity
   * @param {string} as Entity alias
   * @param {string} on Join condition
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .join(FromEntity2, "u", `"u"."columnKey1" = "u1"."columnKey1" AND "u1"."columnKey1" = :key`, { key: "xx" });
   * ```
   */
  join(entity: Function, as: string, on: string, params: ParamComplexValues): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {string} entityName Next entity name, use a period to specify a squema like `"schema.Entity"`
   * @param {string} on Join condition
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .join("FromEntity2", `"FromEntity2"."columnKey1" = "u1"."columnKey1"`);
   * ```
   */
  join(entityName: string, on: string): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {string} entityName Next entity name, use a period to specify a squema like `"schema.Entity"`
   * @param {string} on Join condition
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .join("FromEntity2", `"FromEntity2"."columnKey1" = "u1"."columnKey1" AND "u1"."columnKey1" = :key`, { key: "xx" });
   * ```
   */
  join(entityName: string, on: string, params: ParamComplexValues): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {string} entityName Next entity name, use a period to specify a squema like `"schema.Entity"`
   * @param {string} as Entity alias
   * @param {string} on Join condition
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .join("FromEntity2", "u", `"u"."columnKey1" = "u1"."columnKey1"`);
   * ```
   */
  join(entityName: string, as: string, on: string): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {string} entityName Next entity name, use a period to specify a squema like `"schema.Entity"`
   * @param {string} as Entity alias
   * @param {string} on Join condition
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .join("FromEntity2", "u", `"u"."columnKey1" = "u1"."columnKey1" AND "u1"."columnKey1" = :key`, { key: "xx" });
   * ```
   */
  join(entityName: string, as: string, on: string, params: ParamComplexValues): this;

  /**
   * Clause that is used to combine sub-query with tables and retrieve data based on a common field in relational databases.
   *
   * @param {ExecutorSelect} subQuery A query that is nested inside a `SELECT` statement, or inside another subquery
   * @param {string} on Join condition
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .join("FromEntity2", `"FromEntity2"."columnKey1" = "u1"."columnKey1"`);
   * ```
   */
  join(subQuery: ExecutorSelect, on: string): this;

  /**
   * Clause that is used to combine sub-query with tables and retrieve data based on a common field in relational databases.
   *
   * @param {ExecutorSelect} subQuery A query that is nested inside a `SELECT` statement, or inside another subquery
   * @param {string} on Join condition
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .join("FromEntity2", `"FromEntity2"."columnKey1" = "u1"."columnKey1" AND "u1"."columnKey1" = :key`, { key: "xx" });
   * ```
   */
  join(subQuery: ExecutorSelect, on: string, params: ParamComplexValues): this;

  /**
   * Clause that is used to combine sub-query with tables and retrieve data based on a common field in relational databases.
   *
   * @param {ExecutorSelect} subQuery A query that is nested inside a `SELECT` statement, or inside another subquery
   * @param {string} as Sub-query alias
   * @param {string} on Join condition
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .join("FromEntity2", "u", `"u"."columnKey1" = "u1"."columnKey1"`);
   * ```
   */
  join(subQuery: ExecutorSelect, as: string, on: string): this;

  /**
   * Clause that is used to combine sub-query with tables and retrieve data based on a common field in relational databases.
   *
   * @param {ExecutorSelect} subQuery A query that is nested inside a `SELECT` statement, or inside another subquery
   * @param {string} as Sub-query alias
   * @param {string} on Join condition
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .join("FromEntity2", "u", `"u"."columnKey1" = "u1"."columnKey1" AND "u1"."columnKey1" = :key`, { key: "xx" });
   * ```
   */
  join(subQuery: ExecutorSelect, as: string, on: string, params: ParamComplexValues): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {ParamClauseOptions} clauseOption Clause option
   * @returns {ExecutorSelect}  Return ExecutorSelect to chain functions
   * ```typescript
   *  ... .join({ entity: FromEntity, as: "u", on: `"u"."columnKey1" = "u1"."columnKey1"`})
   * ```
   */
  join(clauseOption: ParamClauseOptions): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {ParamClauseOptions} clauseOption Clause options
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect}  Return ExecutorSelect to chain functions
   * ```typescript
   *  ... .join({ entity: FromEntity, as: "u", on: `"u"."columnKey1" = "u1"."columnKey1"`})
   * ```
   */
  join(clauseOption: ParamClauseOptions, params?: ParamComplexValues): this;

  /**
   * Base function
   */
  join(
    // deno-lint-ignore camelcase
    entity_entityName_subQuery_clauseOption: Function | string | ExecutorSelect | ParamClauseOptions,
    // deno-lint-ignore camelcase
    maybe_on_params_as?: string | ParamComplexValues,
    // deno-lint-ignore camelcase
    maybe_params_on?: ParamComplexValues | string,
    // deno-lint-ignore camelcase
    meybe_params?: ParamComplexValues,
  ): this {
    const r = this.#managingJoinParams(
      entity_entityName_subQuery_clauseOption,
      maybe_on_params_as,
      maybe_params_on,
      meybe_params,
    );
    this.sb.join(r.e as any, r.params as any);
    return this;
  }

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {Function} entity Next entity
   * @param {string} on Join condition
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .joinAndSelect(FromEntity2, `"FromEntity2"."columnKey1" = "u1"."columnKey1"`);
   * ```
   */
  joinAndSelect(entity: Function, on: string): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {Function} entity Next entity
   * @param {string} on Join condition
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *   ... .joinAndSelect(FromEntity2, `"FromEntity2"."columnKey1" = "u1"."columnKey1" AND "u1"."columnKey1" = :key`, { key: "xx" });
   * ```
   */
  joinAndSelect(entity: Function, on: string, params: ParamComplexValues): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {Function} entity: Function = next entity
   * @param {string} as: string = entity alias
   * @param {string} on: string = joinAndSelect condition
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .joinAndSelect(FromEntity2, "u", `"u"."columnKey1" = "u1"."columnKey1"`);
   * ```
   */
  joinAndSelect(entity: Function, as: string, on: string): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {Function} entity Next entity
   * @param {string} as Entity alias
   * @param {string} on Join condition
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .joinAndSelect(FromEntity2, "u", `"u"."columnKey1" = "u1"."columnKey1" AND "u1"."columnKey1" = :key`, { key: "xx" });
   * ```
   */
  joinAndSelect(entity: Function, as: string, on: string, params: ParamComplexValues): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {string} entityName Next entity, use a period to specify a squema like `"schema.Entity"`
   * @param {string} on Join condition
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .joinAndSelect("FromEntity2", `"FromEntity2"."columnKey1" = "u1"."columnKey1"`);
   * ```
   */
  joinAndSelect(entityName: string, on: string): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {string} entity Next entity, use a period to specify a squema like `"schema.Entity"`
   * @param {string} on Join condition
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .joinAndSelect("FromEntity2", `"FromEntity2"."columnKey1" = "u1"."columnKey1" AND "u1"."columnKey1" = :key`, { key: "xx" });
   * ```
   */
  joinAndSelect(entityName: string, on: string, params: ParamComplexValues): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {string} entity Next entity, use a period to specify a squema like `"schema.Entity"`
   * @param {string} as Entity alias
   * @param {string} on Join condition
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .joinAndSelect("FromEntity2", "u", `"u"."columnKey1" = "u1"."columnKey1"`);
   * ```
   */
  joinAndSelect(entityName: string, as: string, on: string): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {string} entity Next entity, use a period to specify a squema like `"schema.Entity"`
   * @param {string} as Entity alias
   * @param {string} on Join condition
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .joinAndSelect("FromEntity2", "u", `"u"."columnKey1" = "u1"."columnKey1" AND "u1"."columnKey1" = :key`, { key: "xx" });
   * ```
   */
  joinAndSelect(entityName: string, as: string, on: string, params: ParamComplexValues): this;

  /**
   * Clause that is used to combine sub-query with tables and retrieve data based on a common field in relational databases.
   *
   * @param {ExecutorSelect} subQuery A query that is nested inside a `SELECT` statement, or inside another subquery
   * @param {string} on Join condition
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .joinAndSelect("FromEntity2", `"FromEntity2"."columnKey1" = "u1"."columnKey1"`);
   * ```
   */
  joinAndSelect(subQuery: ExecutorSelect, on: string): this;

  /**
   * Clause that is used to combine sub-query with tables and retrieve data based on a common field in relational databases.
   *
   * @param {ExecutorSelect} subQuery A query that is nested inside a `SELECT` statement, or inside another subquery
   * @param {string} on Join condition
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .joinAndSelect("FromEntity2", `"FromEntity2"."columnKey1" = "u1"."columnKey1" AND "u1"."columnKey1" = :key`, { key: "xx" });
   * ```
   */
  joinAndSelect(subQuery: ExecutorSelect, on: string, params: ParamComplexValues): this;

  /**
   * Clause that is used to combine sub-query with tables and retrieve data based on a common field in relational databases.
   *
   * @param {ExecutorSelect} subQuery A query that is nested inside a `SELECT` statement, or inside another subquery
   * @param {string} as Entity alias
   * @param {string} on Join condition
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .joinAndSelect("FromEntity2", "u", `"u"."columnKey1" = "u1"."columnKey1"`);
   * ```
   */
  joinAndSelect(subQuery: ExecutorSelect, as: string, on: string): this;

  /**
   * Clause that is used to combine sub-query with tables and retrieve data based on a common field in relational databases.
   *
   * @param {ExecutorSelect} subQuery A query that is nested inside a `SELECT` statement, or inside another subquery
   * @param {string} as Entity alias
   * @param {string} on Join condition
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .joinAndSelect("FromEntity2", "u", `"u"."columnKey1" = "u1"."columnKey1" AND "u1"."columnKey1" = :key`, { key: "xx" });
   * ```
   */
  joinAndSelect(subQuery: ExecutorSelect, as: string, on: string, params: ParamComplexValues): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {ParamClauseOptions} clauseOption
   * @returns {ExecutorSelect}  Return ExecutorSelect to chain functions
   * ```typescript
   *  ... .joinAndSelect({ entity: FromEntity, as: "u", on: `"u"."columnKey1" = "u1"."columnKey1"`})
   * ```
   */
  joinAndSelect(clauseOption: ParamClauseOptions): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {ParamClauseOptions} clauseOption Clause options
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect}  Return ExecutorSelect to chain functions
   * ```typescript
   *  ... .joinAndSelect({ entity: FromEntity, as: "u", on: `"u"."columnKey1" = "u1"."columnKey1"`})
   * ```
   */
  joinAndSelect(clauseOption: ParamClauseOptions, params?: ParamComplexValues): this;

  /**
   * Base function
   */
  joinAndSelect(
    // deno-lint-ignore camelcase
    entity_entityName_subQuery_clauseOption: Function | string | ExecutorSelect | ParamClauseOptions,
    // deno-lint-ignore camelcase
    maybe_on_params_as?: string | ParamComplexValues,
    // deno-lint-ignore camelcase
    maybe_params_on?: ParamComplexValues | string,
    // deno-lint-ignore camelcase
    meybe_params?: ParamComplexValues,
  ): this {
    const r = this.#managingJoinParams(
      entity_entityName_subQuery_clauseOption,
      maybe_on_params_as,
      maybe_params_on,
      meybe_params,
    );
    this.sb.joinAndSelect(r.e as any, r.params as any);
    return this;
  }

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {Function} entity Next entity
   * @param {string} on Join condition
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .left(FromEntity2, `"FromEntity2"."columnKey1" = "u1"."columnKey1"`);
   * ```
   */
  left(entity: Function, on: string): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {Function} entity Next entity
   * @param {string} on Join condition
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *   ... .left(FromEntity2, `"FromEntity2"."columnKey1" = "u1"."columnKey1" AND "u1"."columnKey1" = :key`, { key: "xx" });
   * ```
   */
  left(entity: Function, on: string, params: ParamComplexValues): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {Function} entity: Function = next entity
   * @param {string} as: string = entity alias
   * @param {string} on: string = left condition
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .left(FromEntity2, "u", `"u"."columnKey1" = "u1"."columnKey1"`);
   * ```
   */
  left(entity: Function, as: string, on: string): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {Function} entity Next entity
   * @param {string} as Entity alias
   * @param {string} on Join condition
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .left(FromEntity2, "u", `"u"."columnKey1" = "u1"."columnKey1" AND "u1"."columnKey1" = :key`, { key: "xx" });
   * ```
   */
  left(entity: Function, as: string, on: string, params: ParamComplexValues): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {string} entityName Next entity, use a period to specify a squema like `"schema.Entity"`
   * @param {string} on Join condition
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .left("FromEntity2", `"FromEntity2"."columnKey1" = "u1"."columnKey1"`);
   * ```
   */
  left(entityName: string, on: string): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {string} entityName Next entity, use a period to specify a squema like `"schema.Entity"`
   * @param {string} on Join condition
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .left("FromEntity2", `"FromEntity2"."columnKey1" = "u1"."columnKey1" AND "u1"."columnKey1" = :key`, { key: "xx" });
   * ```
   */
  left(entityName: string, on: string, params: ParamComplexValues): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {string} entityName Next entity, use a period to specify a squema like `"schema.Entity"`
   * @param {string} as Entity alias
   * @param {string} on Join condition
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .left("FromEntity2", "u", `"u"."columnKey1" = "u1"."columnKey1"`);
   * ```
   */
  left(entityName: string, as: string, on: string): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {string} entityName Next entity, use a period to specify a squema like `"schema.Entity"`
   * @param {string} as Entity alias
   * @param {string} on Join condition
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .left("FromEntity2", "u", `"u"."columnKey1" = "u1"."columnKey1" AND "u1"."columnKey1" = :key`, { key: "xx" });
   * ```
   */
  left(entityName: string, as: string, on: string, params: ParamComplexValues): this;

  /**
   * Clause that is used to combine sub-query with tables and retrieve data based on a common field in relational databases.
   *
   * @param {ExecutorSelect} subQuery A query that is nested inside a `SELECT` statement, or inside another subquery
   * @param {string} on Join condition
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .left("FromEntity2", `"FromEntity2"."columnKey1" = "u1"."columnKey1"`);
   * ```
   */
  left(subQuery: ExecutorSelect, on: string): this;

  /**
   * Clause that is used to combine sub-query with tables and retrieve data based on a common field in relational databases.
   *
   * @param {ExecutorSelect} subQuery A query that is nested inside a `SELECT` statement, or inside another subquery
   * @param {string} on Join condition
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .left("FromEntity2", `"FromEntity2"."columnKey1" = "u1"."columnKey1" AND "u1"."columnKey1" = :key`, { key: "xx" });
   * ```
   */
  left(subQuery: ExecutorSelect, on: string, params: ParamComplexValues): this;

  /**
   * Clause that is used to combine sub-query with tables and retrieve data based on a common field in relational databases.
   *
   * @param {ExecutorSelect} subQuery A query that is nested inside a `SELECT` statement, or inside another subquery
   * @param {string} as Entity alias
   * @param {string} on Join condition
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .left("FromEntity2", "u", `"u"."columnKey1" = "u1"."columnKey1"`);
   * ```
   */
  left(subQuery: ExecutorSelect, as: string, on: string): this;

  /**
   * Clause that is used to combine sub-query with tables and retrieve data based on a common field in relational databases.
   *
   * @param {ExecutorSelect} subQuery A query that is nested inside a `SELECT` statement, or inside another subquery
   * @param {string} as Entity alias
   * @param {string} on Join condition
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .left("FromEntity2", "u", `"u"."columnKey1" = "u1"."columnKey1" AND "u1"."columnKey1" = :key`, { key: "xx" });
   * ```
   */
  left(subQuery: ExecutorSelect, as: string, on: string, params: ParamComplexValues): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {ParamClauseOptions} clauseOption
   * @returns {ExecutorSelect}  Return ExecutorSelect to chain functions
   * ```typescript
   *  ... .left({ entity: FromEntity, as: "u", on: `"u"."columnKey1" = "u1"."columnKey1"`})
   * ```
   */
  left(clauseOption: ParamClauseOptions): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {ParamClauseOptions} clauseOption Clause options
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect}  Return ExecutorSelect to chain functions
   * ```typescript
   *  ... .left({ entity: FromEntity, as: "u", on: `"u"."columnKey1" = "u1"."columnKey1"`})
   * ```
   */
  left(clauseOption: ParamClauseOptions, params?: ParamComplexValues): this;

  /**
   * Base function
   */
  left(
    // deno-lint-ignore camelcase
    entity_entityName_subQuery_clauseOption: Function | string | ExecutorSelect | ParamClauseOptions,
    // deno-lint-ignore camelcase
    maybe_on_params_as?: string | ParamComplexValues,
    // deno-lint-ignore camelcase
    maybe_params_on?: ParamComplexValues | string,
    // deno-lint-ignore camelcase
    meybe_params?: ParamComplexValues,
  ): this {
    const r = this.#managingJoinParams(
      entity_entityName_subQuery_clauseOption,
      maybe_on_params_as,
      maybe_params_on,
      meybe_params,
    );
    this.sb.left(r.e as any, r.params as any);
    return this;
  }

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {Function} entity Next entity
   * @param {string} on Join condition
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .leftAndSelect(FromEntity2, `"FromEntity2"."columnKey1" = "u1"."columnKey1"`);
   * ```
   */
  leftAndSelect(entity: Function, on: string): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {Function} entity Next entity
   * @param {string} on Join condition
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *   ... .leftAndSelect(FromEntity2, `"FromEntity2"."columnKey1" = "u1"."columnKey1" AND "u1"."columnKey1" = :key`, { key: "xx" });
   * ```
   */
  leftAndSelect(entity: Function, on: string, params: ParamComplexValues): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {Function} entity: Function = next entity
   * @param {string} as: string = entity alias
   * @param {string} on: string = leftAndSelect condition
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .leftAndSelect(FromEntity2, "u", `"u"."columnKey1" = "u1"."columnKey1"`);
   * ```
   */
  leftAndSelect(entity: Function, as: string, on: string): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {Function} entity Next entity
   * @param {string} as Entity alias
   * @param {string} on Join condition
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .leftAndSelect(FromEntity2, "u", `"u"."columnKey1" = "u1"."columnKey1" AND "u1"."columnKey1" = :key`, { key: "xx" });
   * ```
   */
  leftAndSelect(entity: Function, as: string, on: string, params: ParamComplexValues): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {string} entityName Next entity, use a period to specify a squema like `"schema.Entity"`
   * @param {string} on Join condition
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .leftAndSelect("FromEntity2", `"FromEntity2"."columnKey1" = "u1"."columnKey1"`);
   * ```
   */
  leftAndSelect(entityName: string, on: string): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {string} entityName Next entity, use a period to specify a squema like `"schema.Entity"`
   * @param {string} on Join condition
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .leftAndSelect("FromEntity2", `"FromEntity2"."columnKey1" = "u1"."columnKey1" AND "u1"."columnKey1" = :key`, { key: "xx" });
   * ```
   */
  leftAndSelect(entityName: string, on: string, params: ParamComplexValues): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {string} entityName Next entity, use a period to specify a squema like `"schema.Entity"`
   * @param {string} as Entity alias
   * @param {string} on Join condition
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .leftAndSelect("FromEntity2", "u", `"u"."columnKey1" = "u1"."columnKey1"`);
   * ```
   */
  leftAndSelect(entityName: string, as: string, on: string): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {string} entityName Next entity, use a period to specify a squema like `"schema.Entity"`
   * @param {string} as Entity alias
   * @param {string} on Join condition
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .leftAndSelect("FromEntity2", "u", `"u"."columnKey1" = "u1"."columnKey1" AND "u1"."columnKey1" = :key`, { key: "xx" });
   * ```
   */
  leftAndSelect(entityName: string, as: string, on: string, params: ParamComplexValues): this;

  /**
   * Clause that is used to combine sub-query with tables and retrieve data based on a common field in relational databases.
   *
   * @param {ExecutorSelect} subQuery A query that is nested inside a `SELECT` statement, or inside another subquery
   * @param {string} on Join condition
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .leftAndSelect("FromEntity2", `"FromEntity2"."columnKey1" = "u1"."columnKey1"`);
   * ```
   */
  leftAndSelect(subQuery: ExecutorSelect, on: string): this;

  /**
   * Clause that is used to combine sub-query with tables and retrieve data based on a common field in relational databases.
   *
   * @param {ExecutorSelect} subQuery A query that is nested inside a `SELECT` statement, or inside another subquery
   * @param {string} on Join condition
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .leftAndSelect("FromEntity2", `"FromEntity2"."columnKey1" = "u1"."columnKey1" AND "u1"."columnKey1" = :key`, { key: "xx" });
   * ```
   */
  leftAndSelect(subQuery: ExecutorSelect, on: string, params: ParamComplexValues): this;

  /**
   * Clause that is used to combine sub-query with tables and retrieve data based on a common field in relational databases.
   *
   * @param {ExecutorSelect} subQuery A query that is nested inside a `SELECT` statement, or inside another subquery
   * @param {string} as Entity alias
   * @param {string} on Join condition
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .leftAndSelect("FromEntity2", "u", `"u"."columnKey1" = "u1"."columnKey1"`);
   * ```
   */
  leftAndSelect(subQuery: ExecutorSelect, as: string, on: string): this;

  /**
   * Clause that is used to combine sub-query with tables and retrieve data based on a common field in relational databases.
   *
   * @param {ExecutorSelect} subQuery A query that is nested inside a `SELECT` statement, or inside another subquery
   * @param {string} as Entity alias
   * @param {string} on Join condition
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .leftAndSelect("FromEntity2", "u", `"u"."columnKey1" = "u1"."columnKey1" AND "u1"."columnKey1" = :key`, { key: "xx" });
   * ```
   */
  leftAndSelect(subQuery: ExecutorSelect, as: string, on: string, params: ParamComplexValues): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {ParamClauseOptions} clauseOption
   * @returns {ExecutorSelect}  Return ExecutorSelect to chain functions
   * ```typescript
   *  ... .leftAndSelect({ entity: FromEntity, as: "u", on: `"u"."columnKey1" = "u1"."columnKey1"`})
   * ```
   */
  leftAndSelect(clauseOption: ParamClauseOptions): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {ParamClauseOptions} clauseOption Clause options
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect}  Return ExecutorSelect to chain functions
   * ```typescript
   *  ... .leftAndSelect({ entity: FromEntity, as: "u", on: `"u"."columnKey1" = "u1"."columnKey1"`})
   * ```
   */
  leftAndSelect(clauseOption: ParamClauseOptions, params?: ParamComplexValues): this;

  /**
   * Base function
   */
  leftAndSelect(
    // deno-lint-ignore camelcase
    entity_entityName_subQuery_clauseOption: Function | string | ExecutorSelect | ParamClauseOptions,
    // deno-lint-ignore camelcase
    maybe_on_params_as?: string | ParamComplexValues,
    // deno-lint-ignore camelcase
    maybe_params_on?: ParamComplexValues | string,
    // deno-lint-ignore camelcase
    meybe_params?: ParamComplexValues,
  ): this {
    const r = this.#managingJoinParams(
      entity_entityName_subQuery_clauseOption,
      maybe_on_params_as,
      maybe_params_on,
      meybe_params,
    );
    this.sb.join(r.e as any, r.params as any);
    return this;
  }

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {Function} entity Next entity
   * @param {string} on Join condition
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .right(FromEntity2, `"FromEntity2"."columnKey1" = "u1"."columnKey1"`);
   * ```
   */
  right(entity: Function, on: string): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {Function} entity Next entity
   * @param {string} on Join condition
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *   ... .right(FromEntity2, `"FromEntity2"."columnKey1" = "u1"."columnKey1" AND "u1"."columnKey1" = :key`, { key: "xx" });
   * ```
   */
  right(entity: Function, on: string, params: ParamComplexValues): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {Function} entity: Function = next entity
   * @param {string} as: string = entity alias
   * @param {string} on: string = right condition
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .right(FromEntity2, "u", `"u"."columnKey1" = "u1"."columnKey1"`);
   * ```
   */
  right(entity: Function, as: string, on: string): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {Function} entity Next entity
   * @param {string} as Entity alias
   * @param {string} on Join condition
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .right(FromEntity2, "u", `"u"."columnKey1" = "u1"."columnKey1" AND "u1"."columnKey1" = :key`, { key: "xx" });
   * ```
   */
  right(entity: Function, as: string, on: string, params: ParamComplexValues): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {string} entityName Next entity, use a period to specify a squema like `"schema.Entity"`
   * @param {string} on Join condition
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .right("FromEntity2", `"FromEntity2"."columnKey1" = "u1"."columnKey1"`);
   * ```
   */
  right(entityName: string, on: string): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {string} entityName Next entity, use a period to specify a squema like `"schema.Entity"`
   * @param {string} on Join condition
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .right("FromEntity2", `"FromEntity2"."columnKey1" = "u1"."columnKey1" AND "u1"."columnKey1" = :key`, { key: "xx" });
   * ```
   */
  right(entityName: string, on: string, params: ParamComplexValues): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {string} entityName Next entity, use a period to specify a squema like `"schema.Entity"`
   * @param {string} as Entity alias
   * @param {string} on Join condition
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .right("FromEntity2", "u", `"u"."columnKey1" = "u1"."columnKey1"`);
   * ```
   */
  right(entityName: string, as: string, on: string): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {string} entityName Next entity, use a period to specify a squema like `"schema.Entity"`
   * @param {string} as Entity alias
   * @param {string} on Join condition
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .right("FromEntity2", "u", `"u"."columnKey1" = "u1"."columnKey1" AND "u1"."columnKey1" = :key`, { key: "xx" });
   * ```
   */
  right(entityName: string, as: string, on: string, params: ParamComplexValues): this;

  /**
   * Clause that is used to combine sub-query with tables and retrieve data based on a common field in relational databases.
   *
   * @param {ExecutorSelect} subQuery A query that is nested inside a `SELECT` statement, or inside another subquery
   * @param {string} on Join condition
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .right("FromEntity2", `"FromEntity2"."columnKey1" = "u1"."columnKey1"`);
   * ```
   */
  right(subQuery: ExecutorSelect, on: string): this;

  /**
   * Clause that is used to combine sub-query with tables and retrieve data based on a common field in relational databases.
   *
   * @param {ExecutorSelect} subQuery A query that is nested inside a `SELECT` statement, or inside another subquery
   * @param {string} on Join condition
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .right("FromEntity2", `"FromEntity2"."columnKey1" = "u1"."columnKey1" AND "u1"."columnKey1" = :key`, { key: "xx" });
   * ```
   */
  right(subQuery: ExecutorSelect, on: string, params: ParamComplexValues): this;

  /**
   * Clause that is used to combine sub-query with tables and retrieve data based on a common field in relational databases.
   *
   * @param {ExecutorSelect} subQuery A query that is nested inside a `SELECT` statement, or inside another subquery
   * @param {string} as Entity alias
   * @param {string} on Join condition
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .right("FromEntity2", "u", `"u"."columnKey1" = "u1"."columnKey1"`);
   * ```
   */
  right(subQuery: ExecutorSelect, as: string, on: string): this;

  /**
   * Clause that is used to combine sub-query with tables and retrieve data based on a common field in relational databases.
   *
   * @param {ExecutorSelect} subQuery A query that is nested inside a `SELECT` statement, or inside another subquery
   * @param {string} as Entity alias
   * @param {string} on Join condition
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .right("FromEntity2", "u", `"u"."columnKey1" = "u1"."columnKey1" AND "u1"."columnKey1" = :key`, { key: "xx" });
   * ```
   */
  right(subQuery: ExecutorSelect, as: string, on: string, params: ParamComplexValues): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {ParamClauseOptions} clauseOption
   * @returns {ExecutorSelect}  Return ExecutorSelect to chain functions
   * ```typescript
   *  ... .right({ entity: FromEntity, as: "u", on: `"u"."columnKey1" = "u1"."columnKey1"`})
   * ```
   */
  right(clauseOption: ParamClauseOptions): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {ParamClauseOptions} clauseOption Clause options
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect}  Return ExecutorSelect to chain functions
   * ```typescript
   *  ... .right({ entity: FromEntity, as: "u", on: `"u"."columnKey1" = "u1"."columnKey1"`})
   * ```
   */
  right(clauseOption: ParamClauseOptions, params?: ParamComplexValues): this;

  /**
   * Base function
   */
  right(
    // deno-lint-ignore camelcase
    entity_entityName_subQuery_clauseOption: Function | string | ExecutorSelect | ParamClauseOptions,
    // deno-lint-ignore camelcase
    maybe_on_params_as?: string | ParamComplexValues,
    // deno-lint-ignore camelcase
    maybe_params_on?: ParamComplexValues | string,
    // deno-lint-ignore camelcase
    meybe_params?: ParamComplexValues,
  ): this {
    const r = this.#managingJoinParams(
      entity_entityName_subQuery_clauseOption,
      maybe_on_params_as,
      maybe_params_on,
      meybe_params,
    );
    this.sb.right(r.e as any, r.params as any);
    return this;
  }

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {Function} entity Next entity
   * @param {string} on Join condition
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .rightAndSelect(FromEntity2, `"FromEntity2"."columnKey1" = "u1"."columnKey1"`);
   * ```
   */
  rightAndSelect(entity: Function, on: string): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {Function} entity Next entity
   * @param {string} on Join condition
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *   ... .rightAndSelect(FromEntity2, `"FromEntity2"."columnKey1" = "u1"."columnKey1" AND "u1"."columnKey1" = :key`, { key: "xx" });
   * ```
   */
  rightAndSelect(entity: Function, on: string, params: ParamComplexValues): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {Function} entity: Function = next entity
   * @param {string} as: string = entity alias
   * @param {string} on: string = rightAndSelect condition
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .rightAndSelect(FromEntity2, "u", `"u"."columnKey1" = "u1"."columnKey1"`);
   * ```
   */
  rightAndSelect(entity: Function, as: string, on: string): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {Function} entity Next entity
   * @param {string} as Entity alias
   * @param {string} on Join condition
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .rightAndSelect(FromEntity2, "u", `"u"."columnKey1" = "u1"."columnKey1" AND "u1"."columnKey1" = :key`, { key: "xx" });
   * ```
   */
  rightAndSelect(entity: Function, as: string, on: string, params: ParamComplexValues): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {string} entity Next entity, use a period to specify a squema like `"schema.Entity"`
   * @param {string} on Join condition
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .rightAndSelect("FromEntity2", `"FromEntity2"."columnKey1" = "u1"."columnKey1"`);
   * ```
   */
  rightAndSelect(entityName: string, on: string): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {string} entity Next entity, use a period to specify a squema like `"schema.Entity"`
   * @param {string} on Join condition
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .rightAndSelect("FromEntity2", `"FromEntity2"."columnKey1" = "u1"."columnKey1" AND "u1"."columnKey1" = :key`, { key: "xx" });
   * ```
   */
  rightAndSelect(entityName: string, on: string, params: ParamComplexValues): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {string} entity Next entity, use a period to specify a squema like `"schema.Entity"`
   * @param {string} as Entity alias
   * @param {string} on Join condition
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .rightAndSelect("FromEntity2", "u", `"u"."columnKey1" = "u1"."columnKey1"`);
   * ```
   */
  rightAndSelect(entityName: string, as: string, on: string): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {string} entity Next entity, use a period to specify a squema like `"schema.Entity"`
   * @param {string} as Entity alias
   * @param {string} on Join condition
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .rightAndSelect("FromEntity2", "u", `"u"."columnKey1" = "u1"."columnKey1" AND "u1"."columnKey1" = :key`, { key: "xx" });
   * ```
   */
  rightAndSelect(entityName: string, as: string, on: string, params: ParamComplexValues): this;

  /**
   * Clause that is used to combine sub-query with tables and retrieve data based on a common field in relational databases.
   *
   * @param {ExecutorSelect} subQuery A query that is nested inside a `SELECT` statement, or inside another subquery
   * @param {string} on Join condition
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .rightAndSelect("FromEntity2", `"FromEntity2"."columnKey1" = "u1"."columnKey1"`);
   * ```
   */
  rightAndSelect(subQuery: ExecutorSelect, on: string): this;

  /**
   * Clause that is used to combine sub-query with tables and retrieve data based on a common field in relational databases.
   *
   * @param {ExecutorSelect} subQuery A query that is nested inside a `SELECT` statement, or inside another subquery
   * @param {string} on Join condition
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .rightAndSelect("FromEntity2", `"FromEntity2"."columnKey1" = "u1"."columnKey1" AND "u1"."columnKey1" = :key`, { key: "xx" });
   * ```
   */
  rightAndSelect(subQuery: ExecutorSelect, on: string, params: ParamComplexValues): this;

  /**
   * Clause that is used to combine sub-query with tables and retrieve data based on a common field in relational databases.
   *
   * @param {ExecutorSelect} subQuery A query that is nested inside a `SELECT` statement, or inside another subquery
   * @param {string} as Entity alias
   * @param {string} on Join condition
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .rightAndSelect("FromEntity2", "u", `"u"."columnKey1" = "u1"."columnKey1"`);
   * ```
   */
  rightAndSelect(subQuery: ExecutorSelect, as: string, on: string): this;

  /**
   * Clause that is used to combine sub-query with tables and retrieve data based on a common field in relational databases.
   *
   * @param {ExecutorSelect} subQuery A query that is nested inside a `SELECT` statement, or inside another subquery
   * @param {string} as Entity alias
   * @param {string} on Join condition
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... .rightAndSelect("FromEntity2", "u", `"u"."columnKey1" = "u1"."columnKey1" AND "u1"."columnKey1" = :key`, { key: "xx" });
   * ```
   */
  rightAndSelect(subQuery: ExecutorSelect, as: string, on: string, params: ParamComplexValues): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {ParamClauseOptions} clauseOption
   * @returns {ExecutorSelect}  Return ExecutorSelect to chain functions
   * ```typescript
   *  ... .rightAndSelect({ entity: FromEntity, as: "u", on: `"u"."columnKey1" = "u1"."columnKey1"`})
   * ```
   */
  rightAndSelect(clauseOption: ParamClauseOptions): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {ParamClauseOptions} clauseOption Clause options
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect}  Return ExecutorSelect to chain functions
   * ```typescript
   *  ... .rightAndSelect({ entity: FromEntity, as: "u", on: `"u"."columnKey1" = "u1"."columnKey1"`})
   * ```
   */
  rightAndSelect(clauseOption: ParamClauseOptions, params?: ParamComplexValues): this;

  /**
   * Base function
   */
  rightAndSelect(
    // deno-lint-ignore camelcase
    entity_entityName_subQuery_clauseOption: Function | string | ExecutorSelect | ParamClauseOptions,
    // deno-lint-ignore camelcase
    maybe_on_params_as?: string | ParamComplexValues,
    // deno-lint-ignore camelcase
    maybe_params_on?: ParamComplexValues | string,
    // deno-lint-ignore camelcase
    meybe_params?: ParamComplexValues,
  ): this {
    const r = this.#managingJoinParams(
      entity_entityName_subQuery_clauseOption,
      maybe_on_params_as,
      maybe_params_on,
      meybe_params,
    );
    this.sb.rightAndSelect(r.e as any, r.params as any);
    return this;
  }

  where(conditions: [string, ...string[]] | string, params?: ParamComplexValues): this {
    this.sb.where(conditions, params);
    return this;
  }

  andWhere(conditions: [string, ...string[]] | string, params?: ParamComplexValues): this {
    this.sb.andWhere(conditions, params);
    return this;
  }

  orWhere(conditions: [string, ...string[]] | string, params?: ParamComplexValues): this {
    this.sb.orWhere(conditions, params);
    return this;
  }

  addWhere(conditions: [string, ...string[]] | string, params?: ParamComplexValues): this {
    this.sb.addWhere(conditions, params);
    return this;
  }

  groupBy(columns: [string, ...string[]] | string): this {
    this.sb.groupBy(columns);
    return this;
  }

  addGroupBy(columns: [string, ...string[]] | string): this {
    this.sb.addGroupBy(columns);
    return this;
  }

  having(conditions: [string, ...string[]] | string, params?: ParamComplexValues): this {
    this.sb.having(conditions, params);
    return this;
  }

  andHaving(conditions: [string, ...string[]] | string, params?: ParamComplexValues): this {
    this.sb.andHaving(conditions, params);
    return this;
  }

  orHaving(conditions: [string, ...string[]] | string, params?: ParamComplexValues): this {
    this.sb.orHaving(conditions, params);
    return this;
  }

  addHaving(conditions: [string, ...string[]] | string, params?: ParamComplexValues): this {
    this.sb.addHaving(conditions, params);
    return this;
  }

  orderBy(...columns: Array<{ column: string; direction?: "ASC" | "DESC" } | [string, ("ASC" | "DESC")?]>): this {
    const tempColumns: Array<{ column: string; direction?: string }> = [];
    for (let i = 0; i < columns.length; i++) {
      if (Array.isArray(columns[i])) {
        const [column, direction] = (columns[i] as [string, string?]);
        tempColumns.push({ column, direction });
      } else {
        tempColumns.push(columns[i] as { column: string; direction?: string });
      }
    }
    this.sb.orderBy(...tempColumns);
    return this;
  }

  addOrderBy(...columns: Array<{ column: string; direction?: "ASC" | "DESC" } | [string, ("ASC" | "DESC")?]>): this {
    const tempColumns: Array<{ column: string; direction?: string }> = [];
    for (let i = 0; i < columns.length; i++) {
      if (Array.isArray(columns[i])) {
        const [column, direction] = (columns[i] as [string, string?]);
        tempColumns.push({ column, direction });
      } else {
        tempColumns.push(columns[i] as { column: string; direction?: string });
      }
    }
    this.sb.addOrderBy(...tempColumns);
    return this;
  }

  params(options?: ParamComplexValues): this {
    this.sb.params(options);
    return this;
  }

  addParams(options: ParamComplexValues): this {
    this.sb.addParams(options);
    return this;
  }

  printSql(): this {
    this.sb.printSql();
    return this;
  }

  getSqls(): string[] {
    const sqls = this.sb.getSqls();
    return sqls;
  }

  getSql(): string {
    const sqls = this.getSqls();
    return sqls.join(";\n");
  }

  async getOne(changes?: any): Promise<any> {
    const query = this.getSqls();
    this.sb.usePrintSql(query);
    const options: Record<string, any> = { changes, transaction: this.transaction };
    const data = await this.driver.getOne(query.join(";\n"), options);
    return data;
  }

  async getMany(changes?: any): Promise<Array<any>> {
    const query = this.getSqls();
    this.sb.usePrintSql(query);
    const options: Record<string, any> = { changes, transaction: this.transaction };
    const data = await this.driver.getMany(query.join(";\n"), options);
    return data;
  }

  getMultiple(): Promise<Array<any>> {
    throw "No implemented";
  }
}
