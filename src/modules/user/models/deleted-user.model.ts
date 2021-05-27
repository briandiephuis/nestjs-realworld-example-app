import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DeletedUser {
  @Field(() => ID)
  deletedUserId: number;
}
