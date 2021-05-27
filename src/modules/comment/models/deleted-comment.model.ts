import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DeletedComment {
  @Field(() => ID)
  deletedCommentId: number;

  @Field(() => ID)
  parentArticleId: number;
}
