import { ConnectionOptions } from "../connection_options.ts";
import { getConnectionOptions, getConnectionsOptions } from "../connection_utils.ts";
import { EntityOptions } from "./options/options.ts";

type StoreRecordData = Record<string, any>;
type StoreData = Record<string, StoreRecordData>;

const DEFAULT_CONN_NAME = "default";
export const GLOBAL_STORE_KEY = "spinosaurusMetadataStore2";

export const generateIndex = (
  type: "entity",
  features: Record<string, unknown>,
  defaultDatabase?: string,
  defaultSchema?: string,
) => {
  const database = (features.database ? features.database : defaultDatabase) || "{{DATABASE}}";
  const schema = (features.schema ? features.schema : defaultSchema) || "{{SCHEMA}}";
  let name = undefined;
  switch (type) {
    case "entity": {
      name = features.name;
      return `${type}_${database}_${schema}_${name}`;
    }
  }
};
function findRecord(
  req: { store: StoreData; indexOrEntity: string | Function; defaultDatabase?: string; defaultSchema?: string },
): [string, StoreRecordData] | undefined {
  if (typeof req.indexOrEntity === "string") {
    for (const key in req.store) {
      let tkey = key;
      let tindexOrEntity = req.indexOrEntity;
      if (req.defaultDatabase) {
        tkey = tkey.replaceAll("{{DATABASE}}", req.defaultDatabase);
        tindexOrEntity = tindexOrEntity.replaceAll("{{DATABASE}}", req.defaultDatabase);
      } else if (req.defaultSchema) {
        tkey = tkey.replaceAll("{{SCHEMA}}", req.defaultSchema);
        tindexOrEntity = tindexOrEntity.replaceAll("{{SCHEMA}}", req.defaultSchema);
      }
      if (tkey === tindexOrEntity) {
        return [key, req.store[key]];
      }
    }
  } else if (typeof req.indexOrEntity === "function") {
    for (const key in req.store) {
      const r = req.store[key];
      if (r.generated.entity.class === req.indexOrEntity) {
        return [key, r];
      }
    }
  }
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

export const saveEntity = async (entity: Function, options: EntityOptions) => {
  await (async () => {})();
  const features: Record<string, any> = {};
  features.local = { entity: entity ? { class: entity, name: entity.name } : undefined, options };
  features.generated = { entity: features.local.entity, options: entity ? { name: entity.name, ...options } : options };
  const index = generateIndex("entity", features.generated.options);
  let store = getStore(options.connectionName);
  store = setStoreData(store, index, features);
  addStore(store, options.connectionName);
};

export async function findEntity(
  req: {
    defaultDatabase: string;
    defaultSchema: string;
    entityOrClass: string | Function;
    nameOrOptions?: string | ConnectionOptions;
  },
): Promise<[string, StoreRecordData] | undefined> {
  const name = (typeof req.nameOrOptions == "object" ? req.nameOrOptions.name : req.nameOrOptions) || DEFAULT_CONN_NAME;
  const store = getStore(name);
  if (typeof req.entityOrClass === "string") {
    const features = { database: req.defaultDatabase, schema: req.defaultSchema, name: req.entityOrClass };
    const index = generateIndex("entity", features);
    const r = await findRecord({ store, indexOrEntity: index });
    if (r) {
      return r;
    }
  }
}
