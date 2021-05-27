import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { Comment } from '../comment/comment.entity';
import { User } from '../user/user.entity';
import { UserModule } from '../user/user.module';
import { Article } from './article.entity';
import { ArticleRepository } from './article.repository';
import { ArticleResolver } from './article.resolver';
import { ArticleService } from './article.service';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [Article, Comment, User] }), UserModule],
  providers: [ArticleResolver, ArticleService, ArticleRepository],
  exports: [ArticleRepository],
})
export class ArticleModule {}
