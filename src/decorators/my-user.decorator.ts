import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

import { User } from '../modules/user/user.entity';

export const MyUser = createParamDecorator(async (data: keyof User, ctx: ExecutionContext) => {
  const req = ctx.getArgByIndex(2).req;

  if (!req) {
    throw new InternalServerErrorException('No request found');
  }

  // if route is protected, there is a user set in the AuthGuard
  if (req.user !== undefined) {
    return !!data ? req.user[data] : req.user;
  }

  // no need to query the db if only the id is requested
  if (req.userId && data === 'id') {
    return req.userId;
  }

  // TODO: If the route is not protected, the userId has been set, query the user from the db
  // if (req.userId !== undefined) {
  //   const user = await UserRepository.findOne(req.userId);
  //   if (!user) {
  //     throw new ForbiddenError('User not found');
  //   }
  //   return !!data ? req.user[data] : req.user;
  // }

  // A user object cannot be
  throw new UnauthorizedException('Request requires authorization');
});
