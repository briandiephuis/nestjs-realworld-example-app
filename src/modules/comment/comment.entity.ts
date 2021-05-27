import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';

import { Article } from '../article/article.entity';
import { User } from '../user/user.entity';

@ObjectType()
@Entity()
export class Comment {
  @Field(() => ID)
  @PrimaryKey()
  id: number;

  @Field(() => Date)
  @Property()
  createdAt = new Date();

  @Field(() => Date)
  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field(() => String)
  @Property()
  body: string;

  @ManyToOne()
  article: Article;

  @ManyToOne()
  author: User;

  constructor(author: User, article: Article, body: string) {
    this.author = author;
    this.article = article;
    this.body = body;
  }
}
