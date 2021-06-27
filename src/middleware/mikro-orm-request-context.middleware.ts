import { MikroORM, RequestContext } from '@mikro-orm/core';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';

import { AppRequest } from '../typings/AppRequest';

@Injectable()
export class MikroOrmRequestContextMiddleware implements NestMiddleware {
  constructor(private readonly orm: MikroORM) {}

  use(req: AppRequest, res: Response, next: NextFunction): void {
    RequestContext.create(this.orm.em, next);
  }
}
