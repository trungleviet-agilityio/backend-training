/*
This file is used to define the validation details interface for the shared module.
*/

export interface IValidationDetails {
  field?: string;
  value?: unknown;
  message?: string;
  code?: string;
  [key: string]: unknown;
}
