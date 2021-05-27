import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateMyUserInput {
  @Field(() => String)
  readonly bio: string;

  @Field(() => String)
  readonly email: string;

  @Field(() => String)
  readonly image: string;

  @Field(() => String)
  readonly username: string;
}
