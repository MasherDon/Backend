import { Request } from 'express';
import { User } from '../schemas/user.schema';
import { userType } from '../type/user.type';

export interface ExpressInterface extends Request {
  user?: User | userType;
}
