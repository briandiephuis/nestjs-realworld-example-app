import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FavoriteArticleInput {
  @Field(() => String)
  readonly slug: string;
}
