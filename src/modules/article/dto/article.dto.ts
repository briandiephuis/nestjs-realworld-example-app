import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ArticleInput {
  @Field(() => String)
  readonly slug: string;
}
