import { ArrayType, Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import slug from 'slug';

import { Comment } from '../comment/comment.entity';
import { User } from '../user/user.entity';

@ObjectType()
@Entity()
export class Article {
  @Field(() => ID)
  @PrimaryKey()
  id: number;

  @Field(() => String)
  @Property()
  slug: string;

  @Field(() => String)
  @Property()
  title: string;

  @Field(() => String)
  @Property()
  description = '';

  @Field(() => String)
  @Property()
  body = '';

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property({ type: ArrayType })
  tagList: string[] = [];

  @Property()
  authorId: number;

  @ManyToOne()
  author: User;

  @OneToMany(() => Comment, (comment) => comment.article, {
    orphanRemoval: true,
  })
  comments = new Collection<Comment>(this);

  @Field(() => Int)
  @Property()
  favoritesCount = 0;

  constructor(author: User, title: string, description: string, body: string) {
    this.author = author;
    this.title = title;
    this.description = description;
    this.body = body;
    this.slug = slug(title, { lower: true }) + '-' + ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
  }
}
