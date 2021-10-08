import { generateName1 } from "../connection/builders/base/sql.ts";
import { ConnectionOptions } from "../connection/connection_options.ts";
import {
  StoreCheckOptions,
  StoreColumnOptions,
  StoreColumnRelationOptions,
  StoreEntityOptions,
  StoreFindUniqueOptions,
  StoreUniqueOptions,
} from "./store_options/store_options.ts";
import {
  StoreFindCheckOptions,
  StoreFindColumnOptions,
  StoreFindEntityOptions,
  StoreFindRelationOptions,
} from "./store_options/store_options.ts";

type StoreRecordData = Record<string, any>;
type StoreData = Record<string, StoreRecordData>;

export const DEFAULT_CONN_NAME = "default";
export const GLOBAL_STORE_KEY = "spinosaurusMetadataStore2";
const tempStore: any[] = [];

export const transferTemp = (connectionName: string) => {
  for (const t of tempStore.filter((x) => x.storeType === "entity")) {
    saveEntity(t.params.classFunction, { connectionName, ...t.params.options });
  }
  for (const t of tempStore.filter((x) => x.storeType === "column")) {
    saveColumn(t.params.classFunction, t.params.propertyKey, { connectionName, ...t.params.options });
  }
  for (const t of tempStore.filter((x) => x.storeType === "column_relation")) {
    saveColumnRelation(t.params.classFunction, t.params.propertyKey, { connectionName, ...t.params.options });
  }
  for (const t of tempStore.filter((x) => x.storeType === "check")) {
    saveCheck(t.params.classFunction, { connectionName, ...t.params.options });
  }
  for (const t of tempStore.filter((x) => x.storeType === "unique")) {
    saveUnique(t.params.classFunction, { connectionName, ...t.params.options });
  }
  for (let i = 0; i < tempStore.length; i++) {
    delete tempStore[i];
  }
};

/**
 * entity name must be the database' name, database and schema has to be register by a decorator
 * property key must be the database' property keys
 */
export const generateIndex = (
  storeType: "entity" | "column" | "relation" | "check" | "unique",
  features: Record<string, unknown>,
  defaultDatabase?: string,
  defaultSchema?: string,
): string => {
  const database = (features.database || defaultDatabase || "{{DATABASE}}");
  const schema = (features.schema || defaultSchema || "{{SCHEMA}}");
  let entityName = undefined;
  let columnName = undefined;
  let relationName = undefined;
  let checkName = undefined;
  let uniqueName = undefined;
  switch (storeType) {
    case "entity": {
      entityName = features.entityName;
      return `${storeType}_${database}_${schema}_${entityName}`;
    }
    case "column": {
      entityName = features.entityName;
      columnName = features.columnName;
      return `${storeType}_${database}_${schema}_${entityName}_${columnName}`;
    }
    case "relation": {
      entityName = features.entityName;
      relationName = features.name;
      return `${storeType}_${relationName}`;
    }
    case "check": {
      entityName = features.entityName;
      checkName = features.name;
      return `${storeType}_${checkName}`;
    }
    case "unique": {
      entityName = features.entityName;
      uniqueName = features.name;
      return `${storeType}_${uniqueName}`;
    }
  }
};
function findRecord(
  req: {
    store: StoreData;
    indexOrEntity: string | Function;
    storeType?: "entity" | "column" | "relation" | "check" | "unique";
    defaultDatabase?: string;
    defaultSchema?: string;
  },
): [string, StoreRecordData] | undefined {
  if (typeof req.indexOrEntity === "string") {
    for (const key in req.store) {
      let tkey = key;
      let index = req.indexOrEntity;
      if (req.defaultDatabase) {
        tkey = tkey.replaceAll("{{DATABASE}}", req.defaultDatabase);
        index = index.replaceAll("{{DATABASE}}", req.defaultDatabase);
      } else if (req.defaultSchema) {
        tkey = tkey.replaceAll("{{SCHEMA}}", req.defaultSchema);
        index = index.replaceAll("{{SCHEMA}}", req.defaultSchema);
      }
      if (tkey === index) {
        if (req.storeType && req.storeType === req.store[key].storeType) {
          return [key, req.store[key]];
        } else {
          return [key, req.store[key]];
        }
      }
    }
  } else if (typeof req.indexOrEntity === "function") {
    for (const key in req.store) {
      const r = req.store[key];
      // if (req.indexOrEntity.name === "InsertEntity6") {
      //   console.log("key", key);
      //   console.log(
      //     "req.indexOrEntity",
      //     req.indexOrEntity,
      //     "r.classFunction",
      //     r.classFunction,
      //     "r.classFunction === req.indexOrEntity",
      //     r.classFunction === req.indexOrEntity,
      //   );
      // }
      if (r.classFunction === req.indexOrEntity) {
        if (req.storeType && req.storeType === r.storeType) {
          return [key, r];
        } else return [key, r];
      }
    }
  }
}

function findRecords(
  req: {
    store: StoreData;
    indexOrEntity: string | Function;
    storeType?: "entity" | "column" | "relation" | "check" | "unique";
    defaultDatabase?: string;
    defaultSchema?: string;
  },
): [string, StoreRecordData][] {
  const rs: [string, StoreRecordData][] = [];
  if (typeof req.indexOrEntity === "string") {
    const r = findRecord(req);
    if (r) {
      rs.push(r);
    }
  } else if (typeof req.indexOrEntity === "function") {
    for (const key in req.store) {
      const r = req.store[key];
      if (r.classFunction === req.indexOrEntity) {
        if (req.storeType && req.storeType === r.storeType) {
          rs.push([key, r]);
        } else rs.push([key, r]);
      }
    }
  }
  return rs;
}

function setStoreData(store: StoreData, indexOrEntity: string | Function, data: Record<string, unknown>): StoreData {
  const r = findRecord({ store, indexOrEntity });
  if (r) {
    store[r[0]] = data;
  } else if (typeof indexOrEntity === "string") {
    store[indexOrEntity] = data;
  }
  return store;
}

function addStore(store: StoreData, nameOrOptions?: string | ConnectionOptions) {
  const name = (typeof nameOrOptions == "object" ? nameOrOptions.name : nameOrOptions) || DEFAULT_CONN_NAME;
  window[GLOBAL_STORE_KEY][name] = { ...window[GLOBAL_STORE_KEY][name], ...store };
}

function getStore(nameOrOptions?: string | ConnectionOptions): StoreData {
  const name = (typeof nameOrOptions == "object" ? nameOrOptions.name : nameOrOptions) || DEFAULT_CONN_NAME;
  if (!window[GLOBAL_STORE_KEY]) {
    window[GLOBAL_STORE_KEY] = {};
  }
  if (!window[GLOBAL_STORE_KEY][name]) {
    window[GLOBAL_STORE_KEY][name] = {};
  }
  const ms = window[GLOBAL_STORE_KEY][name];
  return ms;
}

export const tsaveObject = (
  req: { storeType: "entity" | "column" | "column_relation" | "check" | "unique"; params: any },
) => {
  let t;
  for (let i = 0; i < tempStore.length; i++) {
    if (tempStore[i].storeType === req.storeType && tempStore[i].params === req.params) {
      tempStore[i] = req;
      t = tempStore[i];
    }
  }
  if (!t) {
    tempStore.push(req);
  }
};

//#region Entity
export const saveEntity = (classFunction: Function, options: StoreEntityOptions) => {
  const storeType = "entity";
  const features = {
    localIndex: "",
    foreingIndex: "",
    storeType,
    classFunction,
    options,
    foreing: {
      entityName: options.name || classFunction.name,
      ...options,
    },
  };
  features.localIndex = generateIndex(storeType, { entityName: classFunction.name, ...options });
  features.foreingIndex = generateIndex(storeType, features.foreing);
  let store = getStore(options.connectionName);
  store = setStoreData(store, features.foreingIndex, features);
  addStore(store, options.connectionName);
};

export function findEntity(
  req: {
    entityOrClass: string | Function;
    defaultDatabase?: string;
    defaultSchema?: string;
    nameOrOptions?: string | ConnectionOptions;
  },
): [string, StoreRecordData] | undefined {
  const storeType = "entity";
  const name = (typeof req.nameOrOptions == "object" ? req.nameOrOptions.name : req.nameOrOptions) || DEFAULT_CONN_NAME;
  const store = getStore(name);
  if (typeof req.entityOrClass === "string") {
    const features = { database: req.defaultDatabase, schema: req.defaultSchema, entityName: req.entityOrClass };
    const index = generateIndex(storeType, features);
    const r = findRecord({ store, indexOrEntity: index, storeType });
    if (r) {
      return r;
    }
  } else if (typeof req.entityOrClass === "function") {
    const r = findRecord({ store, indexOrEntity: req.entityOrClass, storeType });
    if (r) {
      return r;
    }
  }
}
//#endregion

//#region Column
export const saveColumn = (classObject: Object, propertyKey: string, options: StoreColumnOptions) => {
  const storeType = "column";
  const classFunction = (classObject instanceof Function ? <Function> classObject : classObject.constructor);
  const entityStoreRecord = findEntity({ entityOrClass: classFunction, nameOrOptions: options.connectionName });
  if (!entityStoreRecord) {
    return;
  }
  const features = {
    localIndex: "",
    foreingIndex: "",
    storeType,
    classFunction,
    propertyKey,
    options,
    foreing: {
      entityName: entityStoreRecord[1].foreing.entityName,
      columnName: options.name || propertyKey,
      ...entityStoreRecord[1].options,
      ...options,
    },
  };
  features.localIndex = generateIndex(storeType, {
    ...entityStoreRecord[1].options,
    entityName: classFunction.name,
    columnName: propertyKey,
    ...options,
  });
  features.foreingIndex = generateIndex(storeType, features.foreing);
  let store = getStore(options.connectionName);
  store = setStoreData(store, features.foreingIndex, features);
  addStore(store, options.connectionName);
};

export function findColumns(req: StoreFindEntityOptions): [string, StoreRecordData][] {
  const name = (typeof req.nameOrOptions == "object" ? req.nameOrOptions.name : req.nameOrOptions) || DEFAULT_CONN_NAME;
  const store = getStore(name);
  let r: [string, StoreRecordData] | undefined;
  if (typeof req.entityOrClass === "string") {
    const features = { database: req.defaultDatabase, schema: req.defaultSchema, entityName: req.entityOrClass };
    const index = generateIndex("entity", features);
    r = findRecord({ store, indexOrEntity: index });
  } else if (typeof req.entityOrClass === "function") {
    r = findRecord({ store, indexOrEntity: req.entityOrClass, storeType: "entity" });
  }
  const rcols: [string, StoreRecordData][] = [];
  if (r) {
    const cols = findRecords({ ...req, store, indexOrEntity: r[1].classFunction, storeType: "column" });
    rcols.push(...cols);
  }
  return rcols;
}

export function findColumn(req: StoreFindColumnOptions): [string, StoreRecordData] | undefined {
  const cols = findColumns(req);
  if (req.propertyKey && req.columnName) {
    return cols.find((x) => x[1].propertyKey === req.propertyKey && x[1].foreing.columnName === req.columnName);
  } else if (req.propertyKey) {
    return cols.find((x) => x[1].propertyKey === req.propertyKey);
  } else if (req.columnName) {
    return cols.find((x) => x[1].foreing.columnName === req.columnName);
  }
}

export function findPrimaryColumns(req: StoreFindEntityOptions): [string, StoreRecordData][] {
  const cols = findColumns(req);
  return cols.filter((x) => x[1].foreing.primary === true);
}
//#endregion

//#region ColumnRelation
export const saveColumnRelation = (classObject: Object, propertyKey: string, options: StoreColumnRelationOptions) => {
  const classFunction = (classObject instanceof Function ? <Function> classObject : classObject.constructor);
  const entityStoreRecord = findEntity({ entityOrClass: classFunction, nameOrOptions: options.connectionName });
  if (!entityStoreRecord) {
    return;
  }
  /**
   * Insert relation first
   */

  const storeType = "relation";
  const nameRefs = findRelations({ entityOrClass: classFunction });
  const emptyNameRefs = nameRefs.filter((x) => !x[1].options.name);
  const relationFeatures = {
    localIndex: "",
    foreingIndex: "",
    storeType,
    classFunction,
    propertyKey,
    options: options.relation,
    foreing: {
      entityName: entityStoreRecord[1].foreing.entityName,
      columnName: options.name || propertyKey,
      relationName: options.name ||
        generateName1({
          prefix: "FK",
          schema: entityStoreRecord[1].foreing.schema,
          entity: entityStoreRecord[1].foreing.entityName,
          sequence: emptyNameRefs.length + 1,
        }),
      position: nameRefs.length + 1,
      sequence: options.name ? undefined : emptyNameRefs.length + 1,
      ...entityStoreRecord[1].options,
      ...options.relation,
    },
  };
  relationFeatures.localIndex = generateIndex(storeType, { entityName: classFunction.name, ...options });
  relationFeatures.foreingIndex = generateIndex(storeType, relationFeatures.foreing);
  let store = getStore(options.connectionName);
  store = setStoreData(store, relationFeatures.foreingIndex, relationFeatures);
  addStore(store, options.connectionName);
  /**
   * Insert column next
   */
  {
    const storeType = "column";
    const columnFeatures = {
      localIndex: "",
      foreingIndex: "",
      storeType,
      classFunction,
      propertyKey,
      options,
      relation: relationFeatures,
      foreing: {
        entityName: entityStoreRecord[1].foreing.entityName,
        columnName: options.name || propertyKey,
        ...entityStoreRecord[1].options,
        ...options,
      },
    };
    columnFeatures.localIndex = generateIndex(storeType, {
      ...entityStoreRecord[1].options,
      entityName: classFunction.name,
      columnName: propertyKey,
      ...options,
    });
    columnFeatures.foreingIndex = generateIndex(storeType, columnFeatures.foreing);
    let store = getStore(options.connectionName);
    store = setStoreData(store, columnFeatures.foreingIndex, columnFeatures);
    addStore(store, options.connectionName);
  }
};

export function findRelations(req: StoreFindEntityOptions): [string, StoreRecordData][] {
  const name = (typeof req.nameOrOptions == "object" ? req.nameOrOptions.name : req.nameOrOptions) || DEFAULT_CONN_NAME;
  const store = getStore(name);
  let r: [string, StoreRecordData] | undefined;
  if (typeof req.entityOrClass === "string") {
    const features = { database: req.defaultDatabase, schema: req.defaultSchema, entityName: req.entityOrClass };
    const index = generateIndex("entity", features);
    r = findRecord({ store, indexOrEntity: index, storeType: "entity" });
  } else if (typeof req.entityOrClass === "function") {
    r = findRecord({ store, indexOrEntity: req.entityOrClass, storeType: "entity" });
  }
  const rcols: [string, StoreRecordData][] = [];
  if (r) {
    const cols = findRecords({ ...req, store, indexOrEntity: r[1].classFunction, storeType: "relation" });
    rcols.push(...cols);
  }
  return rcols;
}

export function findRelation(req: StoreFindRelationOptions): [string, StoreRecordData] | undefined {
  const cols = findRelations(req);
  if (req.relationName) {
    return cols.find((x) => x[1].foreing.relationName === req.relationName);
  }
}

//#endregion

//#region Check
export const saveCheck = (classFunction: Function, options: StoreCheckOptions) => {
  const storeType = "check";
  const entityStoreRecord = findEntity({ entityOrClass: classFunction });
  if (!entityStoreRecord) {
    return;
  }
  const nameChks = findChecks({ entityOrClass: classFunction });
  const emptyNameChks = nameChks.filter((x) => !x[1].options.name);

  const features = {
    localIndex: "",
    foreingIndex: "",
    storeType,
    classFunction,
    options,
    foreing: {
      schema: entityStoreRecord[1].foreing.schema,
      entityName: entityStoreRecord[1].foreing.entityName,
      checkName: options.name ||
        generateName1({
          prefix: "CHK",
          schema: entityStoreRecord[1].foreing.schema,
          entity: entityStoreRecord[1].foreing.entityName,
          sequence: emptyNameChks.length + 1,
        }),
      position: nameChks.length + 1,
      sequence: options.name ? undefined : emptyNameChks.length + 1,
      ...options,
    },
  };
  features.localIndex = generateIndex(storeType, { entityName: classFunction.name, ...options });
  features.foreingIndex = generateIndex(storeType, features.foreing);
  let store = getStore(options.connectionName);
  store = setStoreData(store, features.foreingIndex, features);
  addStore(store, options.connectionName);
};

export function findChecks(req: StoreFindEntityOptions): [string, StoreRecordData][] {
  const name = (typeof req.nameOrOptions == "object" ? req.nameOrOptions.name : req.nameOrOptions) || DEFAULT_CONN_NAME;
  const store = getStore(name);
  let r: [string, StoreRecordData] | undefined;
  if (typeof req.entityOrClass === "string") {
    const features = { database: req.defaultDatabase, schema: req.defaultSchema, entityName: req.entityOrClass };
    const index = generateIndex("entity", features);
    r = findRecord({ store, indexOrEntity: index });
  } else if (typeof req.entityOrClass === "function") {
    r = findRecord({ store, indexOrEntity: req.entityOrClass, storeType: "entity" });
  }
  const rcols: [string, StoreRecordData][] = [];
  if (r) {
    const cols = findRecords({ ...req, store, indexOrEntity: r[1].classFunction, storeType: "check" });
    rcols.push(...cols);
  }
  return rcols;
}

export function findCheck(req: StoreFindCheckOptions): [string, StoreRecordData] | undefined {
  const chks = findChecks(req);
  if (req.checkName) {
    return chks.find((x) => x[1].foreing.checkName === req.checkName);
  }
}
//#endregion

//#region Check
export const saveUnique = (classFunction: Function, options: StoreUniqueOptions) => {
  const storeType = "unique";
  const entityStoreRecord = findEntity({ entityOrClass: classFunction });
  if (!entityStoreRecord) {
    return;
  }
  const nameUnqs = findUniques({ entityOrClass: classFunction });
  const emptyNameUnqs = nameUnqs.filter((x) => !x[1].options.name);
  const columnNames = findColumns({ entityOrClass: classFunction })
    .filter((x) => options.columns.includes(x[1].primaryKey))
    .map((x) => x[1].foreing.columnName);

  const features = {
    localIndex: "",
    foreingIndex: "",
    storeType,
    classFunction,
    options,
    foreing: {
      schema: entityStoreRecord[1].foreing.schema,
      entityName: entityStoreRecord[1].foreing.entityName,
      uniqueName: options.name ||
        generateName1({
          prefix: "UQ",
          schema: entityStoreRecord[1].foreing.schema,
          entity: entityStoreRecord[1].foreing.entityName,
          sequence: emptyNameUnqs.length + 1,
        }),
      position: nameUnqs.length + 1,
      sequence: options.name ? undefined : emptyNameUnqs.length + 1,
      columnNames,
      ...options,
    },
  };
  features.localIndex = generateIndex(storeType, { entityName: classFunction.name, ...options });
  features.foreingIndex = generateIndex(storeType, features.foreing);
  let store = getStore(options.connectionName);
  store = setStoreData(store, features.foreingIndex, features);
  addStore(store, options.connectionName);
};

export function findUniques(req: StoreFindEntityOptions): [string, StoreRecordData][] {
  const name = (typeof req.nameOrOptions == "object" ? req.nameOrOptions.name : req.nameOrOptions) || DEFAULT_CONN_NAME;
  const store = getStore(name);
  let r: [string, StoreRecordData] | undefined;
  if (typeof req.entityOrClass === "string") {
    const features = { database: req.defaultDatabase, schema: req.defaultSchema, entityName: req.entityOrClass };
    const index = generateIndex("entity", features);
    r = findRecord({ store, indexOrEntity: index });
  } else if (typeof req.entityOrClass === "function") {
    r = findRecord({ store, indexOrEntity: req.entityOrClass, storeType: "entity" });
  }
  const rcols: [string, StoreRecordData][] = [];
  if (r) {
    const cols = findRecords({ ...req, store, indexOrEntity: r[1].classFunction, storeType: "unique" });
    rcols.push(...cols);
  }
  return rcols;
}

export function findUnique(req: StoreFindUniqueOptions): [string, StoreRecordData] | undefined {
  const chks = findUniques(req);
  if (req.uniqueName) {
    return chks.find((x) => x[1].foreing.uniqueName === req.uniqueName);
  }
}
//#endregion
