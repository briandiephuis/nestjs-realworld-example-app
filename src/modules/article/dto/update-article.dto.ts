import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateArticleInput {
  @Field(() => String)
  readonly slug: string;

  @Field(() => String)
  readonly title: string;

  @Field(() => String)
  readonly description: string;

  @Field(() => String)
  readonly body: string;

  @Field(() => [String])
  readonly tagList: string[];
}
