import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateArticleInput {
  @Field(() => String)
  readonly title: string;

  @Field(() => String)
  readonly description: string;

  @Field(() => String)
  readonly body: string;

  @Field(() => [String])
  readonly tagList: string[];
}
