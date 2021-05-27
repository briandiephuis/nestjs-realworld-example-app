import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteArticleInput {
  @Field(() => String)
  readonly slug: string;
}
