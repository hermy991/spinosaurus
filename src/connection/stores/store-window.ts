import { EntityOptions } from "./options/options.ts";

const DEFAULT_CONN_NAME = "default";
export const GLOBAL_METADATA_KEY = "spinosaurusMetadataStore2";

export const generateIndex = (type: "entity", features: Record<string, unknown>) => {
  const database = features.database ? features.database : "{{DATABASE}}";
  const schema = features.schema ? features.schema : "{{SCHEMA}}";
  let name = undefined;
  switch (type) {
    case "entity":
      name = features.name;
      break;
  }
  return `${database}_${schema}_${name}`;
};

export function getMetadata(nameOrOptions?: string | ConnectionOptions): MetadataStore {
  const name = (typeof nameOrOptions == "object" ? nameOrOptions.name : nameOrOptions) || DEFAULT_CONN_NAME;
  if (!self[GLOBAL_METADATA_KEY]) {
    self[GLOBAL_METADATA_KEY] = {};
  }
  if (!self[GLOBAL_METADATA_KEY][name]) {
    self[GLOBAL_METADATA_KEY][name] = {};
  }
  const ms = self[GLOBAL_METADATA_KEY][name];
  return ms;
}

export const saveEntity = async (entity: Function, options: EntityOptions) => {
  let features = entity ? { name: entity.name } : {};
  features = { ...features, ...options };
};
