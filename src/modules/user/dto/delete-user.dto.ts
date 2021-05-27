import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteUserInput {
  @Field(() => ID)
  readonly userId: number;
}
