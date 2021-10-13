import { DEFAULT_CONN_NAME, GLOBAL_STORE_KEY } from "./store_globals.ts";
import { StoreData, StoreRecordData } from "./store_options/store_options.ts";
import { generateIndex, getStore } from "./store_util.ts";
import { ConnectionOptions } from "../connection/connection_options.ts";
import {
  StoreFindCheckOptions,
  StoreFindColumnOptions,
  StoreFindEntityOptions,
  StoreFindRelationOptions,
  StoreFindUniqueOptions,
} from "./store_options/store_options.ts";

export function findRecord(
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

export function findRecords(
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

export function findPrimaryColumn(req: StoreFindEntityOptions): [string, StoreRecordData] {
  const cols = findColumns(req);
  // console.log("cols", cols);
  return <any> cols.find((x) => x[1].foreing.primary === true);
}

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
