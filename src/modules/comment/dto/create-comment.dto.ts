import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCommentInput {
  @Field(() => String, {
    description: 'Slug identifying the parent `Article` for this `Comment`',
  })
  readonly articleSlug: string;

  @Field(() => String)
  readonly body: string;
}
