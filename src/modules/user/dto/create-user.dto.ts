import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsNotEmpty()
  readonly username: string;

  @Field(() => String)
  @IsNotEmpty()
  readonly email: string;

  @Field(() => String)
  @IsNotEmpty()
  readonly password: string;
}
