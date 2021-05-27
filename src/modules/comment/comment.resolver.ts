import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { MyUser } from '../../decorators/my-user.decorator';
import { Comment } from './comment.entity';
import { CommentService } from './comment.service';
import { CreateCommentInput } from './dto/create-comment.dto';
import { DeleteCommentInput } from './dto/delete-comment.dto';
import { DeletedComment } from './models/deleted-comment.model';

@Resolver(() => Comment)
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @Mutation(() => Comment, { description: 'Add a `Comment` to an `Article`' })
  async addComment(@MyUser('id') myUserId: number, @Args('input') input: CreateCommentInput): Promise<Comment> {
    return this.commentService.create(myUserId, input);
  }

  @Mutation(() => DeletedComment, {
    description: 'Remove a `Comment` of an `Article`',
  })
  async deleteComment(@Args('input') input: DeleteCommentInput) {
    return this.commentService.delete(input);
  }
}
