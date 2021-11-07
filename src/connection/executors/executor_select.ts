import { Driver } from "../connection_type.ts";
import { BuilderSelect } from "../builders/builder_select.ts";
import { ParamFromEntity } from "../builders/params/param_select.ts";
import { ParamClauseRelation, ParamComplexValues } from "../builders/params/param_select.ts";

export class ExecutorSelect {
  sb: BuilderSelect = new BuilderSelect(<Driver> {});
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
   * @param {string} entityName Entity class name, use a period to specify a squema like `"schema.Entity"`
   * @param {string} as Param is used to rename a entity with an alias.
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... let qb = db.from("User", "u");
   * ```
   */
  from(entityName: string, as: string): this;

  /**
   * The SQL FROM clause is used to list the entity.
   * @param {string} fromOption From option
   * @returns {ExecutorSelect} Return ExecutorSelect to chain functions
   *
   * ```typescript
   *  ... let qb = db.from({ entity: User, as: "u"});
   *  ... let qb = db.from({ schema: "hello", entity: "User", as: "u"});
   * ```
   */
  from(fromOption: ParamFromEntity): this;

  /**
   * Base function
   */
  from(entity_entityName_fromOption: Function | string | ParamFromEntity, maybe_as?: string): this {
    if (typeof entity_entityName_fromOption === "function") {
      // from(entity: Function): this;
      // from(entity: Function, as: string): this;
      this.sb.from({ entity: entity_entityName_fromOption, as: maybe_as });
    } else if (typeof entity_entityName_fromOption === "string") {
      // from(entityName: string): this;
      // from(entityName: string, as: string): this;
      this.sb.from({ entity: entity_entityName_fromOption, as: maybe_as });
    } else if (typeof entity_entityName_fromOption === "object") {
      // from(fromOption: ParamFromEntity): this;
      this.sb.from(entity_entityName_fromOption);
    }
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
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {ParamClauseRelation} clauseOption Clause option
   * @returns {ExecutorSelect}  Return ExecutorSelect to chain functions
   * ```typescript
   *  ... .join({ entity: FromEntity, as: "u", on: `"u"."columnKey1" = "u1"."columnKey1"`})
   * ```
   */
  join(clauseOption: ParamClauseRelation): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {ParamClauseRelation} clauseOption Clause options
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect}  Return ExecutorSelect to chain functions
   * ```typescript
   *  ... .join({ entity: FromEntity, as: "u", on: `"u"."columnKey1" = "u1"."columnKey1"`})
   * ```
   */
  join(clauseOption: ParamClauseRelation, params?: ParamComplexValues): this;

  /**
   * Base function
   */
  join(
    entity_entityName_clauseOption: Function | string | ParamClauseRelation,
    maybe_on_params_as?: string | ParamComplexValues,
    maybe_params_on?: ParamComplexValues | string,
    meybe_params?: ParamComplexValues,
  ): this {
    if (typeof entity_entityName_clauseOption === "function") {
      // join(entity: Function, as: string, on: string): this;
      // join(entity: Function, as: string, on: string, params: ParamComplexValues): this;
      if (typeof maybe_on_params_as === "string" && typeof maybe_params_on === "string") {
        this.sb.join(
          { entity: entity_entityName_clauseOption, as: maybe_on_params_as, on: maybe_params_on },
          meybe_params,
        );
      } // join(entity: Function, on: string, params: ParamComplexValues): this;
      else if (typeof maybe_on_params_as === "string" && typeof maybe_params_on === "object") {
        this.sb.join({ entity: entity_entityName_clauseOption, on: maybe_on_params_as }, maybe_params_on);
      } // join(entity: Function, on: string): this;
      else if (typeof maybe_on_params_as === "string") {
        this.sb.join({ entity: entity_entityName_clauseOption, on: maybe_on_params_as });
      }
    } else if (typeof entity_entityName_clauseOption === "string") {
      // join(entityName: string, as: string, on: string): this;
      // join(entityName: string, as: string, on: string, params: ParamComplexValues): this;
      if (typeof maybe_on_params_as === "string" && typeof maybe_params_on === "string") {
        this.sb.join(
          { entity: entity_entityName_clauseOption, as: maybe_on_params_as, on: maybe_params_on },
          meybe_params,
        );
      } // join(entityName: string, on: string, params: ParamComplexValues): this;
      else if (typeof maybe_on_params_as === "string" && typeof maybe_params_on === "object") {
        this.sb.join({ entity: entity_entityName_clauseOption, on: maybe_on_params_as }, maybe_params_on);
      } // join(entityName: string, on: string): this;
      else if (typeof maybe_on_params_as === "string") {
        this.sb.join({ entity: entity_entityName_clauseOption, on: maybe_on_params_as });
      }
    } else if (typeof entity_entityName_clauseOption === "object") {
      // join(clauseOption: ParamClauseRelation, params?: ParamComplexValues): this;
      if (typeof maybe_on_params_as === "object") {
        this.sb.join(entity_entityName_clauseOption, maybe_on_params_as);
      } // join(clauseOption: ParamClauseRelation): this;
      else {
        this.sb.join(entity_entityName_clauseOption);
      }
    }
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
   * @param {string} entity Next entity, use a period to specify a squema like `"schema.Entity"`
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
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {ParamClauseRelation} clauseOption
   * @returns {ExecutorSelect}  Return ExecutorSelect to chain functions
   * ```typescript
   *  ... .joinAndSelect({ entity: FromEntity, as: "u", on: `"u"."columnKey1" = "u1"."columnKey1"`})
   * ```
   */
  joinAndSelect(clauseOption: ParamClauseRelation): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {ParamClauseRelation} clauseOption Clause options
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect}  Return ExecutorSelect to chain functions
   * ```typescript
   *  ... .joinAndSelect({ entity: FromEntity, as: "u", on: `"u"."columnKey1" = "u1"."columnKey1"`})
   * ```
   */
  joinAndSelect(clauseOption: ParamClauseRelation, params?: ParamComplexValues): this;

  /**
   * Base function
   */
  joinAndSelect(
    entity_entityName_clauseOption: Function | string | ParamClauseRelation,
    maybe_on_params_as?: string | ParamComplexValues,
    maybe_params_on?: ParamComplexValues | string,
    meybe_params?: ParamComplexValues,
  ): this {
    if (typeof entity_entityName_clauseOption === "function") {
      // joinAndSelect(entity: Function, as: string, on: string): this;
      // joinAndSelect(entity: Function, as: string, on: string, params: ParamComplexValues): this;
      if (typeof maybe_on_params_as === "string" && typeof maybe_params_on === "string") {
        this.sb.joinAndSelect(
          { entity: entity_entityName_clauseOption, as: maybe_on_params_as, on: maybe_params_on },
          meybe_params,
        );
      } // joinAndSelect(entity: Function, on: string, params: ParamComplexValues): this;
      else if (typeof maybe_on_params_as === "string" && typeof maybe_params_on === "object") {
        this.sb.joinAndSelect({ entity: entity_entityName_clauseOption, on: maybe_on_params_as }, maybe_params_on);
      } // joinAndSelect(entity: Function, on: string): this;
      else if (typeof maybe_on_params_as === "string") {
        this.sb.joinAndSelect({ entity: entity_entityName_clauseOption, on: maybe_on_params_as });
      }
    } else if (typeof entity_entityName_clauseOption === "string") {
      // joinAndSelect(entityName: string, as: string, on: string): this;
      // joinAndSelect(entityName: string, as: string, on: string, params: ParamComplexValues): this;
      if (typeof maybe_on_params_as === "string" && typeof maybe_params_on === "string") {
        this.sb.joinAndSelect(
          { entity: entity_entityName_clauseOption, as: maybe_on_params_as, on: maybe_params_on },
          meybe_params,
        );
      } // joinAndSelect(entityName: string, on: string, params: ParamComplexValues): this;
      else if (typeof maybe_on_params_as === "string" && typeof maybe_params_on === "object") {
        this.sb.joinAndSelect({ entity: entity_entityName_clauseOption, on: maybe_on_params_as }, maybe_params_on);
      } // joinAndSelect(entityName: string, on: string): this;
      else if (typeof maybe_on_params_as === "string") {
        this.sb.joinAndSelect({ entity: entity_entityName_clauseOption, on: maybe_on_params_as });
      }
    } else if (typeof entity_entityName_clauseOption === "object") {
      // joinAndSelect(clauseOption: ParamClauseRelation, params?: ParamComplexValues): this;
      if (typeof maybe_on_params_as === "object") {
        this.sb.joinAndSelect(entity_entityName_clauseOption, maybe_on_params_as);
      } // joinAndSelect(clauseOption: ParamClauseRelation): this;
      else {
        this.sb.joinAndSelect(entity_entityName_clauseOption);
      }
    }
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
   * @param {string} entity Next entity, use a period to specify a squema like `"schema.Entity"`
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
   * @param {string} entity Next entity, use a period to specify a squema like `"schema.Entity"`
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
   * @param {string} entity Next entity, use a period to specify a squema like `"schema.Entity"`
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
   * @param {string} entity Next entity, use a period to specify a squema like `"schema.Entity"`
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
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {ParamClauseRelation} clauseOption
   * @returns {ExecutorSelect}  Return ExecutorSelect to chain functions
   * ```typescript
   *  ... .left({ entity: FromEntity, as: "u", on: `"u"."columnKey1" = "u1"."columnKey1"`})
   * ```
   */
  left(clauseOption: ParamClauseRelation): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {ParamClauseRelation} clauseOption Clause options
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect}  Return ExecutorSelect to chain functions
   * ```typescript
   *  ... .left({ entity: FromEntity, as: "u", on: `"u"."columnKey1" = "u1"."columnKey1"`})
   * ```
   */
  left(clauseOption: ParamClauseRelation, params?: ParamComplexValues): this;

  /**
   * Base function
   */
  left(
    entity_entityName_clauseOption: Function | string | ParamClauseRelation,
    maybe_on_params_as?: string | ParamComplexValues,
    maybe_params_on?: ParamComplexValues | string,
    meybe_params?: ParamComplexValues,
  ): this {
    if (typeof entity_entityName_clauseOption === "function") {
      // left(entity: Function, as: string, on: string): this;
      // left(entity: Function, as: string, on: string, params: ParamComplexValues): this;
      if (typeof maybe_on_params_as === "string" && typeof maybe_params_on === "string") {
        this.sb.left(
          { entity: entity_entityName_clauseOption, as: maybe_on_params_as, on: maybe_params_on },
          meybe_params,
        );
      } // left(entity: Function, on: string, params: ParamComplexValues): this;
      else if (typeof maybe_on_params_as === "string" && typeof maybe_params_on === "object") {
        this.sb.left({ entity: entity_entityName_clauseOption, on: maybe_on_params_as }, maybe_params_on);
      } // left(entity: Function, on: string): this;
      else if (typeof maybe_on_params_as === "string") {
        this.sb.left({ entity: entity_entityName_clauseOption, on: maybe_on_params_as });
      }
    } else if (typeof entity_entityName_clauseOption === "string") {
      // left(entityName: string, as: string, on: string): this;
      // left(entityName: string, as: string, on: string, params: ParamComplexValues): this;
      if (typeof maybe_on_params_as === "string" && typeof maybe_params_on === "string") {
        this.sb.left(
          { entity: entity_entityName_clauseOption, as: maybe_on_params_as, on: maybe_params_on },
          meybe_params,
        );
      } // left(entityName: string, on: string, params: ParamComplexValues): this;
      else if (typeof maybe_on_params_as === "string" && typeof maybe_params_on === "object") {
        this.sb.left({ entity: entity_entityName_clauseOption, on: maybe_on_params_as }, maybe_params_on);
      } // left(entityName: string, on: string): this;
      else if (typeof maybe_on_params_as === "string") {
        this.sb.left({ entity: entity_entityName_clauseOption, on: maybe_on_params_as });
      }
    } else if (typeof entity_entityName_clauseOption === "object") {
      // left(clauseOption: ParamClauseRelation, params?: ParamComplexValues): this;
      if (typeof maybe_on_params_as === "object") {
        this.sb.left(entity_entityName_clauseOption, maybe_on_params_as);
      } // left(clauseOption: ParamClauseRelation): this;
      else {
        this.sb.left(entity_entityName_clauseOption);
      }
    }
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
   * @param {string} entity Next entity, use a period to specify a squema like `"schema.Entity"`
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
   * @param {string} entity Next entity, use a period to specify a squema like `"schema.Entity"`
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
   * @param {string} entity Next entity, use a period to specify a squema like `"schema.Entity"`
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
   * @param {string} entity Next entity, use a period to specify a squema like `"schema.Entity"`
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
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {ParamClauseRelation} clauseOption
   * @returns {ExecutorSelect}  Return ExecutorSelect to chain functions
   * ```typescript
   *  ... .leftAndSelect({ entity: FromEntity, as: "u", on: `"u"."columnKey1" = "u1"."columnKey1"`})
   * ```
   */
  leftAndSelect(clauseOption: ParamClauseRelation): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {ParamClauseRelation} clauseOption Clause options
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect}  Return ExecutorSelect to chain functions
   * ```typescript
   *  ... .leftAndSelect({ entity: FromEntity, as: "u", on: `"u"."columnKey1" = "u1"."columnKey1"`})
   * ```
   */
  leftAndSelect(clauseOption: ParamClauseRelation, params?: ParamComplexValues): this;

  /**
   * Base function
   */
  leftAndSelect(
    entity_entityName_clauseOption: Function | string | ParamClauseRelation,
    maybe_on_params_as?: string | ParamComplexValues,
    maybe_params_on?: ParamComplexValues | string,
    meybe_params?: ParamComplexValues,
  ): this {
    if (typeof entity_entityName_clauseOption === "function") {
      // leftAndSelect(entity: Function, as: string, on: string): this;
      // leftAndSelect(entity: Function, as: string, on: string, params: ParamComplexValues): this;
      if (typeof maybe_on_params_as === "string" && typeof maybe_params_on === "string") {
        this.sb.leftAndSelect(
          { entity: entity_entityName_clauseOption, as: maybe_on_params_as, on: maybe_params_on },
          meybe_params,
        );
      } // leftAndSelect(entity: Function, on: string, params: ParamComplexValues): this;
      else if (typeof maybe_on_params_as === "string" && typeof maybe_params_on === "object") {
        this.sb.leftAndSelect({ entity: entity_entityName_clauseOption, on: maybe_on_params_as }, maybe_params_on);
      } // leftAndSelect(entity: Function, on: string): this;
      else if (typeof maybe_on_params_as === "string") {
        this.sb.leftAndSelect({ entity: entity_entityName_clauseOption, on: maybe_on_params_as });
      }
    } else if (typeof entity_entityName_clauseOption === "string") {
      // leftAndSelect(entityName: string, as: string, on: string): this;
      // leftAndSelect(entityName: string, as: string, on: string, params: ParamComplexValues): this;
      if (typeof maybe_on_params_as === "string" && typeof maybe_params_on === "string") {
        this.sb.leftAndSelect(
          { entity: entity_entityName_clauseOption, as: maybe_on_params_as, on: maybe_params_on },
          meybe_params,
        );
      } // leftAndSelect(entityName: string, on: string, params: ParamComplexValues): this;
      else if (typeof maybe_on_params_as === "string" && typeof maybe_params_on === "object") {
        this.sb.leftAndSelect({ entity: entity_entityName_clauseOption, on: maybe_on_params_as }, maybe_params_on);
      } // leftAndSelect(entityName: string, on: string): this;
      else if (typeof maybe_on_params_as === "string") {
        this.sb.leftAndSelect({ entity: entity_entityName_clauseOption, on: maybe_on_params_as });
      }
    } else if (typeof entity_entityName_clauseOption === "object") {
      // leftAndSelect(clauseOption: ParamClauseRelation, params?: ParamComplexValues): this;
      if (typeof maybe_on_params_as === "object") {
        this.sb.leftAndSelect(entity_entityName_clauseOption, maybe_on_params_as);
      } // leftAndSelect(clauseOption: ParamClauseRelation): this;
      else {
        this.sb.leftAndSelect(entity_entityName_clauseOption);
      }
    }
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
   * @param {string} entity Next entity, use a period to specify a squema like `"schema.Entity"`
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
   * @param {string} entity Next entity, use a period to specify a squema like `"schema.Entity"`
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
   * @param {string} entity Next entity, use a period to specify a squema like `"schema.Entity"`
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
   * @param {string} entity Next entity, use a period to specify a squema like `"schema.Entity"`
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
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {ParamClauseRelation} clauseOption
   * @returns {ExecutorSelect}  Return ExecutorSelect to chain functions
   * ```typescript
   *  ... .right({ entity: FromEntity, as: "u", on: `"u"."columnKey1" = "u1"."columnKey1"`})
   * ```
   */
  right(clauseOption: ParamClauseRelation): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {ParamClauseRelation} clauseOption Clause options
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect}  Return ExecutorSelect to chain functions
   * ```typescript
   *  ... .right({ entity: FromEntity, as: "u", on: `"u"."columnKey1" = "u1"."columnKey1"`})
   * ```
   */
  right(clauseOption: ParamClauseRelation, params?: ParamComplexValues): this;

  /**
   * Base function
   */
  right(
    entity_entityName_clauseOption: Function | string | ParamClauseRelation,
    maybe_on_params_as?: string | ParamComplexValues,
    maybe_params_on?: ParamComplexValues | string,
    meybe_params?: ParamComplexValues,
  ): this {
    if (typeof entity_entityName_clauseOption === "function") {
      // right(entity: Function, as: string, on: string): this;
      // right(entity: Function, as: string, on: string, params: ParamComplexValues): this;
      if (typeof maybe_on_params_as === "string" && typeof maybe_params_on === "string") {
        this.sb.right(
          { entity: entity_entityName_clauseOption, as: maybe_on_params_as, on: maybe_params_on },
          meybe_params,
        );
      } // right(entity: Function, on: string, params: ParamComplexValues): this;
      else if (typeof maybe_on_params_as === "string" && typeof maybe_params_on === "object") {
        this.sb.right({ entity: entity_entityName_clauseOption, on: maybe_on_params_as }, maybe_params_on);
      } // right(entity: Function, on: string): this;
      else if (typeof maybe_on_params_as === "string") {
        this.sb.right({ entity: entity_entityName_clauseOption, on: maybe_on_params_as });
      }
    } else if (typeof entity_entityName_clauseOption === "string") {
      // right(entityName: string, as: string, on: string): this;
      // right(entityName: string, as: string, on: string, params: ParamComplexValues): this;
      if (typeof maybe_on_params_as === "string" && typeof maybe_params_on === "string") {
        this.sb.right(
          { entity: entity_entityName_clauseOption, as: maybe_on_params_as, on: maybe_params_on },
          meybe_params,
        );
      } // right(entityName: string, on: string, params: ParamComplexValues): this;
      else if (typeof maybe_on_params_as === "string" && typeof maybe_params_on === "object") {
        this.sb.right({ entity: entity_entityName_clauseOption, on: maybe_on_params_as }, maybe_params_on);
      } // right(entityName: string, on: string): this;
      else if (typeof maybe_on_params_as === "string") {
        this.sb.right({ entity: entity_entityName_clauseOption, on: maybe_on_params_as });
      }
    } else if (typeof entity_entityName_clauseOption === "object") {
      // right(clauseOption: ParamClauseRelation, params?: ParamComplexValues): this;
      if (typeof maybe_on_params_as === "object") {
        this.sb.right(entity_entityName_clauseOption, maybe_on_params_as);
      } // right(clauseOption: ParamClauseRelation): this;
      else {
        this.sb.right(entity_entityName_clauseOption);
      }
    }
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
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {ParamClauseRelation} clauseOption
   * @returns {ExecutorSelect}  Return ExecutorSelect to chain functions
   * ```typescript
   *  ... .rightAndSelect({ entity: FromEntity, as: "u", on: `"u"."columnKey1" = "u1"."columnKey1"`})
   * ```
   */
  rightAndSelect(clauseOption: ParamClauseRelation): this;

  /**
   * Clause that is used to combine multiple tables and retrieve data based on a common field in relational databases.
   *
   * @param {ParamClauseRelation} clauseOption Clause options
   * @param {ParamComplexValues} params It's a parameter we used to prevent SQL injection. We could have written: `where("user.name = '" + name + "')`, however this is not safe, as it opens the code to SQL injections
   * @returns {ExecutorSelect}  Return ExecutorSelect to chain functions
   * ```typescript
   *  ... .rightAndSelect({ entity: FromEntity, as: "u", on: `"u"."columnKey1" = "u1"."columnKey1"`})
   * ```
   */
  rightAndSelect(clauseOption: ParamClauseRelation, params?: ParamComplexValues): this;

  /**
   * Base function
   */
  rightAndSelect(
    entity_entityName_clauseOption: Function | string | ParamClauseRelation,
    maybe_on_params_as?: string | ParamComplexValues,
    maybe_params_on?: ParamComplexValues | string,
    meybe_params?: ParamComplexValues,
  ): this {
    if (typeof entity_entityName_clauseOption === "function") {
      // rightAndSelect(entity: Function, as: string, on: string): this;
      // rightAndSelect(entity: Function, as: string, on: string, params: ParamComplexValues): this;
      if (typeof maybe_on_params_as === "string" && typeof maybe_params_on === "string") {
        this.sb.rightAndSelect(
          { entity: entity_entityName_clauseOption, as: maybe_on_params_as, on: maybe_params_on },
          meybe_params,
        );
      } // rightAndSelect(entity: Function, on: string, params: ParamComplexValues): this;
      else if (typeof maybe_on_params_as === "string" && typeof maybe_params_on === "object") {
        this.sb.rightAndSelect({ entity: entity_entityName_clauseOption, on: maybe_on_params_as }, maybe_params_on);
      } // rightAndSelect(entity: Function, on: string): this;
      else if (typeof maybe_on_params_as === "string") {
        this.sb.rightAndSelect({ entity: entity_entityName_clauseOption, on: maybe_on_params_as });
      }
    } else if (typeof entity_entityName_clauseOption === "string") {
      // rightAndSelect(entityName: string, as: string, on: string): this;
      // rightAndSelect(entityName: string, as: string, on: string, params: ParamComplexValues): this;
      if (typeof maybe_on_params_as === "string" && typeof maybe_params_on === "string") {
        this.sb.rightAndSelect(
          { entity: entity_entityName_clauseOption, as: maybe_on_params_as, on: maybe_params_on },
          meybe_params,
        );
      } // rightAndSelect(entityName: string, on: string, params: ParamComplexValues): this;
      else if (typeof maybe_on_params_as === "string" && typeof maybe_params_on === "object") {
        this.sb.rightAndSelect({ entity: entity_entityName_clauseOption, on: maybe_on_params_as }, maybe_params_on);
      } // rightAndSelect(entityName: string, on: string): this;
      else if (typeof maybe_on_params_as === "string") {
        this.sb.rightAndSelect({ entity: entity_entityName_clauseOption, on: maybe_on_params_as });
      }
    } else if (typeof entity_entityName_clauseOption === "object") {
      // rightAndSelect(clauseOption: ParamClauseRelation, params?: ParamComplexValues): this;
      if (typeof maybe_on_params_as === "object") {
        this.sb.rightAndSelect(entity_entityName_clauseOption, maybe_on_params_as);
      } // rightAndSelect(clauseOption: ParamClauseRelation): this;
      else {
        this.sb.rightAndSelect(entity_entityName_clauseOption);
      }
    }
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

  orderBy(
    ...columns: Array<
      { column: string; direction?: "ASC" | "DESC" } | [
        string,
        ("ASC" | "DESC")?,
      ]
    >
  ): this {
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

  addOrderBy(
    ...columns: Array<
      | { column: string; direction?: "ASC" | "DESC" }
      | [string, ("ASC" | "DESC")?]
    >
  ): this {
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
