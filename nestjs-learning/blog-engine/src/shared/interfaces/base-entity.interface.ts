/*
This file is used to define the base entity interface for the shared module.
*/

export interface IBaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface IBaseCreateDto {
  // Common fields for creation DTOs
}

export interface IBaseUpdateDto {
  // Common fields for update DTOs
}

export interface IBaseResponse {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
