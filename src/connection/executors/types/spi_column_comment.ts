/**
 * Tipo que define la capa "spinosaurus", correspondiente a las
 * columnas antes de la capa de base de datos.
 */
export type SpiColumnComment = {
  schema?: string;
  entity: string;
  name: string;
  comment: string;
};
