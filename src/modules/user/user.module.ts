import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { Article } from '../article/article.entity';
import { ArticleService } from '../article/article.service';
import { AuthController } from './auth.controller';
import { User } from './user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  controllers: [AuthController],
  exports: [UserService],
  imports: [MikroOrmModule.forFeature({ entities: [User, Article] })],
  providers: [UserResolver, UserService, ArticleService],
})
export class UserModule {}
