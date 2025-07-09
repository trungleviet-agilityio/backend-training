/*
This file is used to define the request interface for the shared module.
*/

import { Request } from 'express';
import { IJwtPayload } from './jwt-payload.interface';

export interface IRequest extends Request {
  user?: IJwtPayload;
} 