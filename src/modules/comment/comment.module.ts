import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { ArticleModule } from '../article/article.module';
import { User } from '../user/user.entity';
import { UserModule } from '../user/user.module';
import { Comment } from './comment.entity';
import { CommentResolver } from './comment.resolver';
import { CommentService } from './comment.service';

@Module({
  controllers: [],
  imports: [MikroOrmModule.forFeature({ entities: [Comment, User] }), UserModule, ArticleModule],
  providers: [CommentResolver, CommentService],
})
export class CommentModule {}
