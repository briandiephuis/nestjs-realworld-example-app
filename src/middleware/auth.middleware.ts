import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';

import { UserService } from '../modules/user/user.service';
import { verifyJwt } from '../modules/user/utils/auth.util';
import { AppRequest } from '../typings/AppRequest';

/**
 * Auth middleware to parse the authorization header and add the referenced user id to the request.
 *
 * Continues if no `authorization` header is found. If there is an `authorization` header, the JWT
 * is validated and the (user) id field is stored on the `request`. If the JWT is invalid a 403
 * error is returned.
 *
 * The user id on the request can be used in Guards and Interceptors to protect GraphQL queries,
 * mutations, subscriptions or (resolve)fields.
 */
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: AppRequest, res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new ForbiddenException('Invalid authorization header');
    }

    try {
      const payload = verifyJwt(token);
      if (typeof payload.id !== 'number') {
        throw new Error('Invalid token');
      }
      req.userId = payload.id;
    } catch (error) {
      throw new ForbiddenException('Invalid token', error);
    }

    if (!req.userId) {
      throw new ForbiddenException('Invalid token');
    }
    req.user = await this.userService.findById(req.userId);
    if (!req.user) {
      throw new ForbiddenException('User not found.');
    }

    return next();
  }
}
