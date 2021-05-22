import { Request } from 'express';
import { IUserData } from '../../user/user.interface';

export interface AppRequest extends Request {
  user?: IUserData & { id?: string };
}
