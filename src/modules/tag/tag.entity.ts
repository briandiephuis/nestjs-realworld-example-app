import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Tag {
  @Field(() => ID)
  @PrimaryKey()
  id: number;

  @Field(() => String)
  @Property()
  tag: string;
}
