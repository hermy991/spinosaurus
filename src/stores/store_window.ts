// import { reflect } from "../../deps.ts";
// import { Reflect as reflect } from "../libs/Reflect.ts";
import { generateName1 } from "../connection/builders/base/sql.ts";
import {
  StoreCheckOptions,
  StoreColumnOptions,
  StoreEntityOptions,
  StoreRelationOptions,
  StoreUniqueOptions,
} from "./store_options/store_options.ts";
import { StoreData } from "./store_options/store_options.ts";
import {
  findChecks,
  findColumns,
  findEntity,
  findPrimaryColumn,
  findRecord,
  findRelations,
  findUniques,
} from "./store_find.ts";
import { addStore, generateIndex, getStore } from "./store_util.ts";

export const tempStore: any[] = [];

export const transferTemp = (connectionName: string) => {
  for (const t of tempStore.filter((x) => x.storeType === "entity")) {
    t.params.options = { connectionName, ...t.params.options };
    saveEntity(t.params);
  }
  for (const t of tempStore.filter((x) => x.storeType === "column")) {
    t.params.options = { connectionName, ...t.params.options };
    saveColumn(t.params);
  }
  for (const t of tempStore.filter((x) => x.storeType === "column_relation")) {
    t.params.options = { connectionName, ...t.params.options };
    saveColumnRelation(t.params);
  }
  for (const t of tempStore.filter((x) => x.storeType === "check")) {
    t.params.options = { connectionName, ...t.params.options };
    saveCheck(t.params);
  }
  for (const t of tempStore.filter((x) => x.storeType === "unique")) {
    t.params.options = { connectionName, ...t.params.options };
    saveUnique(t.params);
  }
  for (let i = 0; i < tempStore.length; i++) {
    delete tempStore[i];
  }
};
function setStoreData(store: StoreData, indexOrEntity: string | Function, data: Record<string, unknown>): StoreData {
  const r = findRecord({ store, indexOrEntity });
  if (r) {
    store[r[0]] = data;
  } else if (typeof indexOrEntity === "string") {
    store[indexOrEntity] = data;
  }
  return store;
}

export const tsaveObject = (
  req: { storeType: "entity" | "column" | "column_relation" | "check" | "unique"; params: any },
) => {
  let t;
  for (let i = 0; i < tempStore.length; i++) {
    if (!tempStore[i]) {
      continue;
    }
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
export const saveEntity = (req: { classFunction: Function; options: StoreEntityOptions }) => {
  const { classFunction, options } = req;
  const storeType = "entity";
  const features = {
    localIndex: "",
    foreignIndex: "",
    storeType,
    classFunction,
    options,
    foreign: {
      entityName: options.name || classFunction.name,
      ...options,
    },
  };
  features.localIndex = generateIndex(storeType, { entityName: classFunction.name, ...options });
  features.foreignIndex = generateIndex(storeType, features.foreign);
  let store = getStore(options.connectionName);
  store = setStoreData(store, features.foreignIndex, features);
  addStore(store, options.connectionName);
};
//#endregion

//#region Column
export const saveColumn = (
  req: { classFunction: Function; propertyKey: string; type: Function; options: StoreColumnOptions },
) => {
  const { classFunction, type, propertyKey, options } = req;
  const storeType = "column";
  const entityStoreRecord = findEntity({ entityOrClass: classFunction, nameOrOptions: options.connectionName });
  if (!entityStoreRecord) {
    return;
  }
  const columnName = options.name || propertyKey;
  const features = {
    localIndex: "",
    foreignIndex: "",
    storeType,
    classFunction,
    type,
    propertyKey,
    options,
    foreign: {
      entityName: entityStoreRecord[1].foreign.entityName,
      columnName,
      ...entityStoreRecord[1].options,
      ...options,
      name: columnName,
    },
  };
  features.localIndex = generateIndex(storeType, {
    ...entityStoreRecord[1].options,
    entityName: classFunction.name,
    columnName: propertyKey,
    ...options,
  });
  features.foreignIndex = generateIndex(storeType, features.foreign);
  let store = getStore(options.connectionName);
  store = setStoreData(store, features.foreignIndex, features);
  addStore(store, options.connectionName);
};
//#endregion

//#region ColumnRelation
export const saveColumnRelation = (
  req: {
    classFunction: Function;
    type: Function;
    propertyKey: string;
    options: StoreColumnOptions;
    relation: StoreRelationOptions;
  },
) => {
  const { classFunction, type, propertyKey, options, relation } = req;
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
    foreignIndex: "",
    storeType,
    classFunction,
    propertyKey,
    options: relation,
    foreign: {
      entityName: entityStoreRecord[1].foreign.entityName,
      columnName: options.name || propertyKey,
      relationName: options.name ||
        generateName1({
          prefix: "FK",
          schema: entityStoreRecord[1].foreign.schema,
          entity: entityStoreRecord[1].foreign.entityName,
          sequence: emptyNameRefs.length + 1,
        }),
      position: nameRefs.length + 1,
      sequence: options.name ? undefined : emptyNameRefs.length + 1,
      ...entityStoreRecord[1].options,
      ...relation,
    },
  };
  relationFeatures.localIndex = generateIndex(storeType, {
    schema: relationFeatures.foreign.schema,
    entityName: classFunction.name,
    columnName: propertyKey,
  });
  relationFeatures.foreignIndex = generateIndex(storeType, relationFeatures.foreign);
  let store = getStore(options.connectionName);
  store = setStoreData(store, relationFeatures.foreignIndex, relationFeatures);
  addStore(store, options.connectionName);
  /**
   * Insert column next
   */
  {
    let fentityName = entityStoreRecord[1].foreign.entityName;
    let fentityStoreRecord = findEntity({ entityOrClass: type, nameOrOptions: options.connectionName });
    if (!fentityStoreRecord && typeof type === "function" && type.constructor) {
      fentityStoreRecord = findEntity({ entityOrClass: type(), nameOrOptions: options.connectionName });
    }
    if (fentityStoreRecord) {
      fentityName = fentityStoreRecord[1].foreign.entityName;
    }
    let fprimaryColumnName = propertyKey;
    const fprimaryColumnStoreRecord = findPrimaryColumn({ entityOrClass: type, nameOrOptions: options.connectionName });
    if (fprimaryColumnStoreRecord) {
      fprimaryColumnName = fprimaryColumnStoreRecord[1].foreign.columnName;
    }
    let columnName = options.name || `${fentityName}_${fprimaryColumnName}`;
    if (!options.name) {
      let ecolumns = findColumns({ entityOrClass: classFunction, nameOrOptions: options.connectionName });
      ecolumns = ecolumns.filter((col) => col[1].type === type);
      if (ecolumns.length) {
        columnName = `${columnName}_${ecolumns.length + 1}`;
      }
    }
    const storeType = "column";
    const columnFeatures = {
      localIndex: "",
      foreignIndex: "",
      storeType,
      classFunction,
      type,
      propertyKey,
      options,
      relation: relationFeatures,
      foreign: {
        entityName: entityStoreRecord[1].foreign.entityName,
        columnName,
        ...entityStoreRecord[1].options,
        ...options,
        name: columnName,
      },
    };
    columnFeatures.localIndex = generateIndex(storeType, {
      ...entityStoreRecord[1].options,
      entityName: classFunction.name,
      columnName: propertyKey,
      ...options,
    });
    columnFeatures.foreignIndex = generateIndex(storeType, columnFeatures.foreign);
    let store = getStore(options.connectionName);
    store = setStoreData(store, columnFeatures.foreignIndex, columnFeatures);
    addStore(store, options.connectionName);
  }
};

//#endregion

//#region Check
export const saveCheck = (req: { classFunction: Function; options: StoreCheckOptions }) => {
  const { classFunction, options } = req;
  const storeType = "check";
  const entityStoreRecord = findEntity({ entityOrClass: classFunction });
  if (!entityStoreRecord) {
    return;
  }
  const nameChks = findChecks({ entityOrClass: classFunction });
  const emptyNameChks = nameChks.filter((x) => !x[1].options.name);

  const features = {
    localIndex: "",
    foreignIndex: "",
    storeType,
    classFunction,
    options,
    foreign: {
      schema: entityStoreRecord[1].foreign.schema,
      entityName: entityStoreRecord[1].foreign.entityName,
      checkName: options.name ||
        generateName1({
          prefix: "CHK",
          schema: entityStoreRecord[1].foreign.schema,
          entity: entityStoreRecord[1].foreign.entityName,
          sequence: emptyNameChks.length + 1,
        }),
      position: nameChks.length + 1,
      sequence: options.name ? undefined : emptyNameChks.length + 1,
      ...options,
    },
  };
  features.localIndex = generateIndex(storeType, { entityName: classFunction.name, ...options });
  features.foreignIndex = generateIndex(storeType, features.foreign);
  let store = getStore(options.connectionName);
  store = setStoreData(store, features.foreignIndex, features);
  addStore(store, options.connectionName);
};
//#endregion

//#region Check
export const saveUnique = (req: { classFunction: Function; options: StoreUniqueOptions }) => {
  const { classFunction, options } = req;
  const storeType = "unique";
  const entityStoreRecord = findEntity({ entityOrClass: classFunction });
  if (!entityStoreRecord) {
    return;
  }
  const nameUnqs = findUniques({ entityOrClass: classFunction });
  const emptyNameUnqs = nameUnqs.filter((x) => !x[1].options.name);
  const columnNames = findColumns({ entityOrClass: classFunction })
    .filter((x) => options.columns.includes(x[1].primaryKey))
    .map((x) => x[1].foreign.columnName);

  const features = {
    localIndex: "",
    foreignIndex: "",
    storeType,
    classFunction,
    options,
    foreign: {
      schema: entityStoreRecord[1].foreign.schema,
      entityName: entityStoreRecord[1].foreign.entityName,
      uniqueName: options.name ||
        generateName1({
          prefix: "UQ",
          schema: entityStoreRecord[1].foreign.schema,
          entity: entityStoreRecord[1].foreign.entityName,
          sequence: emptyNameUnqs.length + 1,
        }),
      position: nameUnqs.length + 1,
      sequence: options.name ? undefined : emptyNameUnqs.length + 1,
      columnNames,
      ...options,
    },
  };
  features.localIndex = generateIndex(storeType, { entityName: classFunction.name, ...options });
  features.foreignIndex = generateIndex(storeType, features.foreign);
  let store = getStore(options.connectionName);
  store = setStoreData(store, features.foreignIndex, features);
  addStore(store, options.connectionName);
};

//#endregion
