import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

import { Loaders, LoadersType } from '../../decorators/loaders.decorator';
import { MyUser } from '../../decorators/my-user.decorator';
import { Article } from '../article/article.entity';
import { ArticleService } from '../article/article.service';
import { CreateUserInput } from './dto/create-user.dto';
import { DeleteUserInput } from './dto/delete-user.dto';
import { UpdateMyUserInput } from './dto/update-my-user.dto';
import { DeletedUser } from './models/deleted-user.model';
import { User } from './user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService, private readonly articleService: ArticleService) {}

  // -------------------------------------------------------------------------
  // Resolve fields (extend fields on the entity)
  // -------------------------------------------------------------------------

  // Dataloader version -> select "e0".* from "article" as "e0" where "e0"."author_id" in (1, 2, 3)
  // Useful when you expect this relation will be loaded for many parents (i.e. load all articles for many users)
  @ResolveField(() => [Article], { description: '`Articles` written by this `User`' })
  async articles(@Parent() user: User, @Loaders() { userArticles }: LoadersType): Promise<Article[]> {
    return userArticles.load(user.id);
  }

  // Non-dataloader version -> select "e0".* from "article" as "e0" where "e0"."author_id" = 1
  // Faster if you expect this relation to be loaded only once or twice per request (i.e. load only my articles)
  @ResolveField(() => [Article], { description: '`Articles` written by this `User`' })
  async articlesWithoutDataloader(@Parent() user: User): Promise<Article[]> {
    return this.articleService.findByAuthorId(user.id);
  }

  // -------------------------------------------------------------------------
  // Queries (root queries for this entity, queries should not mutate data)
  // -------------------------------------------------------------------------

  @Query(() => User, { description: 'The signed-in `User`' })
  async me(@MyUser('email') myEmail: string): Promise<User> {
    return this.userService.findByEmail(myEmail);
  }

  // -------------------------------------------------------------------------
  // Mutations (root mutations related to this entity)
  // -------------------------------------------------------------------------

  @Mutation(() => User, { description: 'Update the signed in `User`' })
  async updateMyUser(@MyUser('id') myUserId: number, @Args('input') input: UpdateMyUserInput): Promise<User> {
    return this.userService.update(myUserId, input);
  }

  @Mutation(() => User, { description: 'Create a `User`' })
  async createUser(@Args('input') userData: CreateUserInput): Promise<User> {
    return this.userService.create(userData);
  }

  @Mutation(() => DeletedUser, { description: 'Deleate a `User`' })
  async deleteUser(@Args('input') input: DeleteUserInput): Promise<DeletedUser> {
    return this.userService.delete(input);
  }

  // -------------------------------------------------------------------------
  // Subscriptions (real time queries related to this entity)
  // -------------------------------------------------------------------------
}
