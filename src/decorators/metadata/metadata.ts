import { MetadataStore } from "./metadata_store.ts";
import { ColumnType } from "../options/column_type.ts";
import { ConnectionOptionsAll } from "../../connection/connection_options.ts";
import { GeneratedColumnOptions } from "../options/generated_column_options.ts";
import { ColumnOptions } from "../options/column_options.ts";
// import { createHash } from "deno/hash/mod.ts";

const DEFAULT_CONN_NAME = "default";

export const GLOBAL_METADATA_KEY = "spinosaurusMetadataStore";

export const GLOBAL_TEMP_METADATA_KEY = "spinosaurusTempMetadataStore";

declare global {
  var [GLOBAL_METADATA_KEY]: any;
  interface Window {
    [k: string]: any;
  }
}

export function linkMetadata(req: { connName: string }): MetadataStore {
  const { connName } = req;
  const metadata = getMetadata(connName);
  const { tables, relations, checks, uniques, schemas, columns } = metadata;
  /**
   * Find all schemas from entities
   */
  for (const table of tables) {
    if (
      table.mixeds.schema &&
      !schemas.some((x: any) => x.name === table.mixeds.schema)
    ) {
      schemas.push({ name: table.mixeds.schema });
    }
  }
  /**
   * Link columns with tables
   */
  for (const column of columns) {
    const table = tables.find((x: any) => x.target === column.entity.target);
    if (
      table &&
      !table.columns.some((x: any) => x.mixeds.name === column.mixeds.name)
    ) {
      table.columns.push(column);
    }
    const { target, property, options } = column;
    const instance = new column.entity.target();
    // Option Column Lenght
    if (options.length) {
      options.length = Number(options.length);
    }
    // Class Column Type
    if (!(<any> column).relation) {
      options.spitype = getColumnType({
        type: property.type,
        options,
        value: instance[target.name || ""],
      });
    }
    // Class Null Data
    target.nullable = false;
    // Class Default Data
    if (instance[target.name || ""] != undefined) {
      target.default = instance[target.name || ""];
    }
    // When auto increment is set and spitype is undefined we should set spitype to varchar or
    if ((<GeneratedColumnOptions> options).autoIncrement && !options.spitype) {
      const autoIncrement = (<GeneratedColumnOptions> options).autoIncrement;
      if (autoIncrement === "increment" && !options.spitype) {
        options.spitype = "integer";
      } else if (autoIncrement === "uuid" && !options.spitype) {
        options.spitype = "varchar";
        options.length = 30;
      }
      options.nullable = options.nullable || false;
    }
    column.mixeds = <ColumnOptions> Object.assign(target, options);
  }
  /**
   * Link checks constrains with tables
   */
  tables.forEach((x) => x.checks = x.checks || []);
  for (let i = 0; i < checks.length; i++) {
    const check = checks[i];
    const table = tables.find((x: any) => x.target === check.target);
    if (!table) {
      continue;
    }
    if (
      !table.checks.some((x: any) =>
        x.target === check.target &&
        (x.mixeds.name || "") === (check.mixeds.name || "") &&
        x.mixeds.expression === check.mixeds.expression
      )
    ) {
      table.checks.push(check);
    }
  }
  /**
   * Link uniques constrains with tables
   */
  tables.forEach((x) => x.uniques = x.uniques || []);
  // Global uniques constraints
  for (let i = tables.length - 1; i >= 0; i--) {
    const table = tables[i];
    const gcolumns = [];
    for (let y = 0; y < table.columns.length; y++) {
      const column = table.columns[y];
      if (!column.mixeds.unique) {
        continue;
      }
      gcolumns.push(column.property.propertyKey);
    }
    const gunique = {
      target: table.target,
      options: { columns: gcolumns },
      mixeds: { columns: gcolumns },
    };
    if (gunique.mixeds.columns.length) {
      uniques.unshift(gunique);
    }
  }
  // Column uniques constraints
  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    for (let y = table.columns.length - 1; y >= 0; y--) {
      const column = table.columns[y];
      if (!column.mixeds.uniqueOne) {
        continue;
      }
      const cunique = {
        target: table.target,
        options: { columns: [column.property.propertyKey] },
        mixeds: { columns: [column.property.propertyKey] },
      };
      if (cunique.mixeds.columns.length) {
        uniques.unshift(cunique);
      }
    }
  }
  for (let i = 0; i < uniques.length; i++) {
    const unique = uniques[i];
    const table = tables.find((x: any) => x.target === unique.target);
    if (!table) {
      continue;
    }
    if (
      !table.uniques.some((x: any) =>
        x.target === unique.target &&
        (x.mixeds.name || "") === (unique.mixeds.name || "") &&
        (x.mixeds.columns || []).join(",") ===
          (unique.mixeds.columns || []).join(",")
      )
    ) {
      table.uniques.push(unique);
    }
  }
  /**
   * Link relation constrains with tables
   */
  tables.forEach((x) => x.relations = x.relations || []);
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if ((<any> column).relation) {
      const relation = (<any> column).relation;
      // Find foreing column
      const fcolumn = columns.find((x) =>
        x.entity.target === relation.entity &&
        (<any> x.mixeds).primary === true
      );
      // Find foreing entity
      const ftable = tables.find((x) => x.target === relation.entity);
      if (!fcolumn || !ftable) {
        continue;
      }
      // Update mixeds
      column.mixeds.name ||= `${ftable.mixeds.name}_${fcolumn.mixeds.name}`;
      column.mixeds.spitype ||= fcolumn.mixeds.spitype;
      // Update tables and relations
      const table = tables.find((x) => x.target === column.entity.target);
      if (table) {
        table.relations.push(column);
        relations.push(column);
      }
    }
  }
  // Errors and Exceptions
  for (const table of metadata.tables) {
    if (!table.columns.length) {
      throw (`Entity '${table.mixeds.name}' needs column(property) definition, use @Column, @PrimaryColumn, @PrimaryGeneratedColumn, etc.`);
    }
  }
  for (const column of columns) {
    if (!column.mixeds.spitype) {
      throw (`Property '${column.property.propertyKey}' Data type cannot be determined, use { type: "?" } or define the data type in the property.`);
    }
  }
  return metadata;
}

/**
 * Without params, default key will be return from registry
 */
export function getMetadata(): MetadataStore;

/**
  * Name key will be return from registry
  */
export function getMetadata(name: string): MetadataStore;

/**
  * Option name atribute will be return from registry
  */
export function getMetadata(options: ConnectionOptionsAll): MetadataStore;

/**
  * Option name atribute or name param will be return from registry
  */
export function getMetadata(
  nameOrOptions?: string | ConnectionOptionsAll,
): MetadataStore {
  const name =
    (typeof nameOrOptions == "object" ? nameOrOptions.name : nameOrOptions) ||
    DEFAULT_CONN_NAME;
  if (!window[GLOBAL_METADATA_KEY]) {
    window[GLOBAL_METADATA_KEY] = {};
  }
  if (!window[GLOBAL_TEMP_METADATA_KEY]) {
    window[GLOBAL_TEMP_METADATA_KEY] = {};
  }
  if (!window[GLOBAL_METADATA_KEY][name]) {
    window[GLOBAL_METADATA_KEY][name] =
      window[GLOBAL_TEMP_METADATA_KEY][DEFAULT_CONN_NAME]
        ? getTempMetadata()
        : new MetadataStore();
    clearTempMetadata();
  }
  const ms = window[GLOBAL_METADATA_KEY][name];
  return ms;
}

// /**
//  * Without params, default key will be return from temp registry
//  */
// export function getTempMetadata(): MetadataStore;

// /**
//  * Name key will be return from temp registry
//  */
// export function getTempMetadata(name: string): MetadataStore;

// /**
//  * Option name atribute will be return from temp registry
//  */
// export function getTempMetadata(options: ConnectionOptions): MetadataStore;

/**
 * Option name atribute or name param will be return from temp registry
 */
export function getTempMetadata(
  // nameOrOptions?: string | ConnectionOptions,
): MetadataStore {
  const name = DEFAULT_CONN_NAME;
  if (!window[GLOBAL_TEMP_METADATA_KEY]) {
    window[GLOBAL_TEMP_METADATA_KEY] = {};
  }
  if (!window[GLOBAL_TEMP_METADATA_KEY][name]) {
    window[GLOBAL_TEMP_METADATA_KEY][name] = new MetadataStore();
  }
  return window[GLOBAL_TEMP_METADATA_KEY][name];
}

/**
 * Without params default key will be deleted on registry
 */
export function clearMetadata(): void;

/**
 * Name key will be deleted on registry
 */
export function clearMetadata(name: string): void;

/**
 * Option name atribute will be deleted on registry
 */
export function clearMetadata(options: ConnectionOptionsAll): void;

/**
 * Option name atribute or name param will be deleted on registry
 */
export function clearMetadata(
  nameOrOptions?: string | ConnectionOptionsAll,
): void {
  const name =
    (typeof nameOrOptions == "object" ? nameOrOptions.name : nameOrOptions) ||
    DEFAULT_CONN_NAME;
  if (window[GLOBAL_METADATA_KEY]) {
    delete window[GLOBAL_METADATA_KEY][name];
  } else {
    window[GLOBAL_METADATA_KEY] = {};
  }
}

/**
 * Without params default key will be deleted on temp registry
 */
// export function clearTempMetadata(): void;

// /**
//   * Name key will be deleted on temp registry
//   */
// export function clearTempMetadata(name: string): void;

// /**
//   * Option name atribute will be deleted on temp registry
//   */
// export function clearTempMetadata(options: ConnectionOptions): void;

// /**
//   * Option name atribute or name param will be deleted on temp registry
//   */
export function clearTempMetadata(
  // nameOrOptions?: string | ConnectionOptions
) {
  const name = DEFAULT_CONN_NAME;
  if (window[GLOBAL_TEMP_METADATA_KEY]) {
    delete window[GLOBAL_TEMP_METADATA_KEY][name];
  } else {
    window[GLOBAL_TEMP_METADATA_KEY] = {};
  }
}

export function linkMetadataToFromData(
  req: { connName: string; entity: Function },
): any {
  const metadata = linkMetadata(req);
  const t = metadata.tables.find((x) => x.target === req.entity);
  if (t) {
    return {
      entity: t.mixeds.name,
      schema: t.mixeds.schema,
    };
  }
}

export function linkMetadataToColumnAccesors(
  req: { currentSquema: string; connName: string },
  fun: Function,
): Array<string> {
  const metadata = linkMetadata(req);
  const t = metadata.tables.find((x) => x.target === fun);
  if (t) {
    const columns = t.columns.map((x: any) => ({
      select: true,
      insert: true,
      update: true,
      ...x.mixeds,
    }));
    return columns;
  }
  return [];
}

export function getColumnType(
  params: { type: any; options?: any; value?: any },
) {
  let { type, options, value } = params;
  let spitype: ColumnType | undefined = undefined;
  /**
 * Type by value
 */
  if (value != undefined && value != null) {
    type = value.constructor;
  }
  /**
 * Type by explicit type
 */
  if (type.name === "ArrayBuffer" || type.name === "Blob") {
    spitype = "bytearray";
  } else if (type.name === "String") {
    spitype = "text";
  } else if (type.name === "Number") {
    spitype = "numeric";
  } else if (type.name === "Boolean") {
    spitype = "boolean";
  } else if (type.name === "Date") {
    spitype = "timestamp";
  } else if (type.name === "BigInt") {
    spitype = "bigint";
  }
  /**
 * Type by options
 */
  if (options) {
    if (type.name === "String" && options.length) {
      spitype = `varchar`;
    } else if (type.name === "Number" && options.precision) {
      spitype = "numeric";
    } else if (type.name === "Number") {
      if (options.length == 2) {
        spitype = `smallint`;
      } else if (options.length == 4) {
        spitype = `integer`;
      } else if (options.length == 8) {
        spitype = `bigint`;
      }
    }

    if (options.type) {
      spitype = options.type;
    }
  }
  return spitype;
}
