import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DeletedArticle {
  @Field(() => ID)
  deletedArticleId: number;
}
