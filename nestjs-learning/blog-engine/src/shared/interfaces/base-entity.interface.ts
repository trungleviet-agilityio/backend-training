/**
 * Base Entity Interfaces
 * Common interfaces for database entities
 */

/**
 * Base entity fields that all entities should have
 */
export interface IBaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/**
 * Entity creation data without auto-generated fields
 */
export interface IEntityCreateData {
  [key: string]: unknown;
}

/**
 * Entity update data (partial)
 */
export interface IEntityUpdateData {
  [key: string]: unknown;
}

export interface IBaseResponse {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
