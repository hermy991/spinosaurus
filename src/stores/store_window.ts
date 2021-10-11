import { generateName1 } from "../connection/builders/base/sql.ts";
import {
  StoreCheckOptions,
  StoreColumnOptions,
  StoreColumnRelationOptions,
  StoreEntityOptions,
  StoreUniqueOptions,
} from "./store_options/store_options.ts";
import { StoreData } from "./store_options/store_options.ts";
import { findChecks, findColumns, findEntity, findRecord, findRelations, findUniques } from "./store_find.ts";
import { addStore, generateIndex, getStore } from "./store_util.ts";

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
  console.log(
    "relationFeatures.localIndex",
    relationFeatures.localIndex,
    "relationFeatures.foreingIndex",
    relationFeatures.foreingIndex,
  );
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

//#endregion
