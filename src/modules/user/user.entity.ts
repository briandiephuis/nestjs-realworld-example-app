import { Collection, Entity, EntityRepositoryType, ManyToMany, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { hashSync } from 'bcryptjs';
import { IsEmail } from 'class-validator';

import { Article } from '../article/article.entity';
import { UserRepository } from './user.repository';

@ObjectType()
@Entity()
export class User {
  [EntityRepositoryType]?: UserRepository;

  @Field(() => ID)
  @PrimaryKey()
  id: number;

  @Property()
  blocked_at?: Date;

  @Property({ comment: 'Refresh tokens provided before this timestamp are no longer valid' })
  invalidated_at?: Date;

  @Field(() => String)
  @Property()
  username: string;

  @Property({ hidden: true })
  @IsEmail()
  email: string;

  @Field(() => String)
  @Property()
  bio = '';

  @Field(() => String)
  @Property()
  image = '';

  @Property({ hidden: true })
  password: string;

  @ManyToMany({ hidden: true })
  favorites = new Collection<Article>(this);

  @ManyToMany({
    entity: () => User,
    inversedBy: (u) => u.followed,
    owner: true,
    pivotTable: 'user_to_follower',
    joinColumn: 'follower',
    inverseJoinColumn: 'following',
    hidden: true,
  })
  followers = new Collection<User>(this);

  @ManyToMany(() => User, (u) => u.followers, { hidden: true })
  followed = new Collection<User>(this);

  @Field(() => [Article])
  @OneToMany(() => Article, (article) => article.author)
  articles = new Collection<Article>(this);

  constructor(username: string, email: string, password: string) {
    this.username = username;
    this.email = email;
    this.password = hashSync(password);
  }
}
