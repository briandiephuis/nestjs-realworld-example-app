import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { Article } from '../article/article.entity';
import { User } from '../user/user.entity';
import { Comment } from './comment.entity';
import { CreateCommentInput } from './dto/create-comment.dto';
import { DeleteCommentInput } from './dto/delete-comment.dto';
import { DeletedComment } from './models/deleted-comment.model';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: EntityRepository<Article>,
    @InjectRepository(Comment)
    private readonly commentRepository: EntityRepository<Comment>,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async create(myUserId: number, { articleSlug, ...input }: CreateCommentInput): Promise<Comment> {
    const article = await this.articleRepository.findOneOrFail({ slug: articleSlug }, ['author']);
    const author = await this.userRepository.findOneOrFail(myUserId);
    const comment = new Comment(author, article, input.body);
    await this.commentRepository.persistAndFlush(comment);

    return comment;
  }

  async delete({ articleSlug, commentId }: DeleteCommentInput): Promise<DeletedComment> {
    const article = await this.articleRepository.findOneOrFail({ slug: articleSlug }, ['author']);
    const comment = this.commentRepository.getReference(commentId);

    if (article.comments.contains(comment)) {
      article.comments.remove(comment);
      await this.commentRepository.removeAndFlush(comment);
    }

    return {
      deletedCommentId: commentId,
      parentArticleId: article.id,
    };
  }
}
