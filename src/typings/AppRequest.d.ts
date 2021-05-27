import { Request } from 'express';

import { User } from '../modules/user/user.entity';

export interface AppRequest extends Request {
  userId?: number;
  user?: User;
}
