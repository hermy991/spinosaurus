import { MetadataStore } from "./metadata_store.ts";
import { ColumnType } from "../options/column_type.ts";
import { ConnectionOptions } from "../../connection/connection_options.ts";
import { PrimaryGeneratedColumnOptions } from "../options/primary_generated_column_options.ts";
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
  /**
   * Link columns with properties
   */
  linkColumnsProperties(metadata);
  /**
   * Find all schemas from entities
   */
  linkSchemas(metadata);
  /**
   * Link columns with tables
   */
  linkColumnsWithTables(metadata);
  /**
   * Link relation to a columns
   */
  linkRelationsWithColumns(metadata);
  /**
   * Link checks constrains with tables
   */
  linkChecksWithTables(metadata);
  /**
   * Link uniques constrains with tables
   */
  linkUniquesWithTables(metadata);
  /**
   * Link relation constrains with tables
   */
  linkRelationsWithTables(metadata);
  /**
   * Link relation constrains with tables
   */
  linkDataWithTables(metadata);
  /**
   * Link nexts sql sentences with tables
   */
  linkNextWithTables(metadata);
  /**
   * Link afters sql sentences with tables
   */
  linkAfterWithTables(metadata);
  /**
   * Check errors and exeptions
   */
  checkErrorsAndExeptions(metadata);
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
export function getMetadata(options: ConnectionOptions): MetadataStore;

/**
  * Option name atribute or name param will be return from registry
  */
export function getMetadata(
  nameOrOptions?: string | ConnectionOptions,
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
export function clearMetadata(options: ConnectionOptions): void;

/**
 * Option name atribute or name param will be deleted on registry
 */
export function clearMetadata(
  nameOrOptions?: string | ConnectionOptions,
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
export function getMetadataEntityData(
  req: { connName: string; entity: Function },
): any {
  const metadata = getMetadata(req.connName);
  const t = metadata.tables.find((x) => x.target === req.entity);
  if (t) {
    return {
      entity: t.mixeds.name,
      schema: t.mixeds.schema,
    };
  }
}
export function getMetadataColumns(
  req: { connName: string; entity: Function },
): Array<any> {
  const metadata = getMetadata(req.connName);
  linkColumnsProperties(metadata);
  const columns = metadata.columns.filter((x) =>
    x.entity.target === req.entity ||
    (new (<any> req).entity()) instanceof x.entity.target
  )
    .map((x: any) => ({
      select: true,
      insert: true,
      update: true,
      ...x.property,
      ...x.mixeds,
    }));
  return columns;
}
export function getMetadataChecks(
  req: { connName: string; entity: Function },
): Array<string> {
  const metadata = getMetadata(req.connName);
  const chks = metadata.checks.filter((x) => x.target === req.entity)
    .map((x: any) => ({ ...x.mixeds }));
  return chks;
}
export function getMetadataUniques(
  req: { connName: string; entity: Function },
): Array<string> {
  const metadata = getMetadata(req.connName);
  linkUniquesWithTables(metadata);
  const chks = metadata.uniques.filter((x) => x.target === req.entity)
    .map((x: any) => ({ ...x.mixeds }));
  return chks;
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
  } else if (
    type.name === "Date" ||
    (value instanceof Function &&
      (value.name === "Date" || value.name === "_NOW"))
  ) {
    spitype = "timestamp";
  } else if (type.name === "BigInt") {
    spitype = "bigint";
  } else if (value instanceof Function) {
    // Custom function like _NOW, etc.
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

function linkColumnsProperties(metadata: MetadataStore) {
  const { columns, tables } = metadata;
  for (const column of columns) {
    const { target, property, relation, options } = <any> column;
    const instance = new column.entity.target();
    // Option Column Lenght
    if (options.length) {
      options.length = Number(options.length);
    }
    // Class Column Type
    if (!relation) {
      options.spitype = getColumnType({
        type: property.type,
        options,
        value: instance[target.name || ""],
      });
    } else if (
      relation.entity instanceof Function && relation.entity.name === "entity"
    ) {
      // When type es a function like { entity: () => Person } changet for entity: Person
      // this changes mitigate circular decorator depency in TypeScript.
      property.type = relation.entity();
      relation.entity = relation.entity();
    }
    // Class Null Data
    target.nullable = false;
    // Class Default Data
    if (instance[target.name || ""] != undefined) {
      target.default = instance[target.name || ""];
    }
    // When auto increment is set and spitype is undefined we should set spitype to varchar or
    if (
      (<PrimaryGeneratedColumnOptions> options).autoIncrement &&
      !options.spitype
    ) {
      const autoIncrement =
        (<PrimaryGeneratedColumnOptions> options).autoIncrement;
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
  return { columns, tables };
}

function linkSchemas(metadata: MetadataStore) {
  const { tables, schemas } = metadata;
  for (const table of tables) {
    if (
      table.mixeds.schema &&
      !schemas.some((x: any) => x.name === table.mixeds.schema)
    ) {
      schemas.push({ name: table.mixeds.schema });
    }
  }
  return { tables, schemas };
}

function linkRelationsWithColumns(metadata: MetadataStore) {
  const { columns, tables } = metadata;
  for (const column of columns) {
    const { target, property, relation, options } = <any> column;
    // Relations
    if (relation) {
      const ftable = tables.find((x: any) =>
        x.target === (relation.entity || property.type)
      );
      if (ftable) {
        const fcolumn = columns.find((x) =>
          x.entity.target === ftable.target && (<any> x.mixeds).primary
        );
        if (fcolumn) {
          if (!options.name) {
            target.name = `${ftable.mixeds.name}_${fcolumn.mixeds.name}`;
          }
          if ((<any> fcolumn).mixeds.primary) {
            if ((<any> fcolumn).mixeds.autoIncrement === "increment") {
              target.spitype = "integer";
            } else if ((<any> fcolumn).mixeds.autoIncrement === "uuid") {
              target.spitype = "varchar";
              target.length = 30;
            } else {
              target.spitype = fcolumn.mixeds.spitype;
              target.length = fcolumn.mixeds.length;
              target.precision = fcolumn.mixeds.precision;
              target.scale = fcolumn.mixeds.scale;
            }
          }
        }
      }
    }
  }
  // Indexing column name relation
  for (const table of tables) {
    const columns = table.columns;
    for (let i = 0; i < columns.length; i++) {
      if (!columns[i].relation) {
        continue;
      }
      let index = 1;
      for (let y = i + 1; y < columns.length; y++) {
        if (columns[y].mixeds.name === columns[i].mixeds.name) {
          columns[y].mixeds.name = `${columns[i].mixeds.name}_${++index}`;
        }
      }
      if (index > 1) {
        columns[i].mixeds.name = `${columns[i].mixeds.name}_1`;
      }
    }
  }
  return { columns, tables };
}
function linkChecksWithTables(metadata: MetadataStore) {
  const { tables, checks } = metadata;
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
  return { tables, checks };
}
function linkUniquesWithTables(metadata: MetadataStore) {
  const { columns, tables, uniques } = metadata;
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
  // Changing property column to database column
  uniques.forEach((m) => {
    m.mixeds["columnNames"] = m.mixeds.columns.map((x: any) => {
      const column = columns.find((c) =>
        c.entity.target === m.target && c.property.propertyKey === x
      );
      if (column) {
        return column.mixeds.name;
      }
    }).filter((x: any) => x);
  });
  // Link uniques to tables
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
  return { tables, uniques };
}
function linkRelationsWithTables(metadata: MetadataStore) {
  const { columns, tables, relations } = metadata;
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
      if (
        table &&
        !relations.some((x) =>
          x.entity.target === column.entity.target &&
          x.mixeds.name === column.mixeds.name
        )
      ) {
        table.relations.push(column);
        relations.push(column);
      }
    }
  }
  return { columns, tables, relations };
}
function linkColumnsWithTables(metadata: MetadataStore) {
  const { columns, tables } = metadata;
  const addColumn = (column: any, predicate: Function) => {
    const xtables = tables.filter(<any> predicate);
    for (const table of xtables) {
      if (
        table &&
        !table.columns.some((x: any) => x.mixeds.name === column.mixeds.name)
      ) {
        table.columns.push(column);
      }
    }
  };
  columns.forEach((column) =>
    addColumn(column, (x: any) => x.target === column.entity.target)
  );
  columns.forEach((column) =>
    addColumn(
      column,
      (x: any) => (new x.target()) instanceof column.entity.target,
    )
  );
  return { columns, tables };
}
function linkDataWithTables(metadata: MetadataStore) {
  const { columns, tables, data } = metadata;
  tables.forEach((x) => x.data = x.data || []);
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const table = tables.find((x: any) => x.target === row.target);
    if (!table) {
      continue;
    }
    const primaryColumn = columns.find((c) =>
      c.entity.target === row.target && (<any> c.mixeds).primary === true
    );
    if (primaryColumn) {
      table.data.indexOf(row) === -1 ? table.data.push(row) : undefined;
    }
  }
  return { tables, data };
}
function linkNextWithTables(metadata: MetadataStore) {
  const { tables, nexts } = metadata;
  tables.forEach((x) => x.nexts = x.nexts || []);
  for (let i = 0; i < nexts.length; i++) {
    const row = nexts[i];
    const table = tables.find((x: any) => x.target === row.target);
    if (!table) {
      continue;
    }
    table.nexts.indexOf(row) === -1 ? table.nexts.push(row) : undefined;
  }
  return { tables, nexts };
}
function linkAfterWithTables(metadata: MetadataStore) {
  const { tables, afters } = metadata;
  tables.forEach((x) => x.afters = x.afters || []);
  for (let i = 0; i < afters.length; i++) {
    const row = afters[i];
    const table = tables.find((x: any) => x.target === row.target);
    if (!table) {
      continue;
    }
    table.afters.indexOf(row) === -1 ? table.afters.push(row) : undefined;
  }
  return { tables, afters };
}
function checkErrorsAndExeptions(metadata: MetadataStore) {
  const { columns, tables } = metadata;
  for (const table of tables) {
    if (!table.columns.length) {
      throw (`Entity '${table.mixeds.name}' needs column(property) definition, use @Column, @PrimaryColumn, @PrimaryGeneratedColumn, etc.`);
    }
  }
  for (const column of columns) {
    if (!column.mixeds.spitype) {
      throw (`Property '${column.property.propertyKey}' Data type cannot be determined, use { spitype: "?" } or define the data type in the property.`);
    }
  }
}
