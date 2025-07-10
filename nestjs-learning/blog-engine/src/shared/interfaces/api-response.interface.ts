/*
This file is used to define the API response interface for the shared module.
*/

import { IValidationDetails } from './validation-details.interface';

export interface IApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode: number;
  timestamp: string;
  path: string;
}

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface IPaginatedResponse<T> {
  data: T[];
  meta: IPaginationMeta;
}

export interface IErrorResponse {
  success: false;
  message: string;
  error: string;
  statusCode: number;
  timestamp: string;
  path: string;
  details?: IValidationDetails;
}
