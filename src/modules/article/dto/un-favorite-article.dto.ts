import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UnFavoriteArticleInput {
  @Field(() => String)
  readonly slug: string;
}
