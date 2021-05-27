import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteCommentInput {
  @Field(() => String, {
    description: 'Slug identifying the parent `Article` for this `Comment`',
  })
  readonly articleSlug: string;

  @Field(() => ID)
  readonly commentId: number;
}
