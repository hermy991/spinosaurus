import { SpiColumnDefinition } from "./spi_column_definition.ts";
import { SpiGeneratedColumnDefinition } from "./spi_generated_column_definition.ts";

/**
 * Tipo que define la capa "spinosaurus", correspondiente a las
 * columnas antes de la capa de base de datos.
 */
export type SpiAllColumnDefinition =
  | SpiColumnDefinition
  | SpiGeneratedColumnDefinition;
