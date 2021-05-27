import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

import { MyUser } from '../../decorators/my-user.decorator';
import { Comment } from '../comment/comment.entity';
import { Article } from './article.entity';
import { ArticleService } from './article.service';
import { ArticleInput } from './dto/article.dto';
import { CreateArticleInput } from './dto/create-article.dto';
import { DeleteArticleInput } from './dto/delete-article.dto';
import { FavoriteArticleInput } from './dto/favorite-article.dto';
import { UnFavoriteArticleInput } from './dto/un-favorite-article.dto';
import { UpdateArticleInput } from './dto/update-article.dto';
import { DeletedArticle } from './models/deleted-article.model';

@Resolver(() => Article)
export class ArticleResolver {
  constructor(private readonly articleService: ArticleService) {}

  // -------------------------------------------------------------------------
  // Resolve fields (extend fields on the entity)
  // -------------------------------------------------------------------------

  @ResolveField(() => [Comment], {
    description: 'Get the `Comments` for an `Article`',
  })
  async comments(@Parent() article: Article): Promise<Comment[]> {
    return this.articleService.findComments(article.slug);
  }

  // -------------------------------------------------------------------------
  // Queries (root queries for this entity, queries should not mutate data)
  // -------------------------------------------------------------------------

  // @Query(() => [Article], { description: 'Get all `Articles`' })
  // async articles(@MyUser('id') userId: number): Promise<Article[]> {
  //   return this.articleService.findAll(userId);
  // }

  // @Query(() => [Article], { description: 'Get my `Article` feed' })
  // async feed(@MyUser('id') userId: number): Promise<IArticlesRO> {
  //   return this.articleService.findFeed(+userId, query);
  // }

  @Query(() => Article, { description: 'Get one `Article` by its slug' })
  async article(@Args('input') input: ArticleInput): Promise<Article> {
    return this.articleService.findOne(input);
  }

  // -------------------------------------------------------------------------
  // Mutations (root mutations related to this entity)
  // -------------------------------------------------------------------------

  @Mutation(() => Article, { description: 'Create an `Article`' })
  async createArticle(@MyUser('id') userId: number, @Args('input') input: CreateArticleInput): Promise<Article> {
    return this.articleService.create(userId, input);
  }

  @Mutation(() => Article, { description: 'Update an `Article`' })
  async updateArticle(@Args('input') input: UpdateArticleInput): Promise<Article> {
    // Todo: update slug also when title gets changed
    return this.articleService.update(input);
  }

  @Mutation(() => DeletedArticle, { description: 'Delete an `Article`' })
  async deleteArticle(@Args('input') input: DeleteArticleInput): Promise<DeletedArticle> {
    return this.articleService.delete(input);
  }

  @Mutation(() => Article, { description: 'Favorite an `Article`' })
  async favoriteArticle(@MyUser('id') userId: number, @Args('input') input: FavoriteArticleInput): Promise<Article> {
    return this.articleService.favorite(userId, input);
  }

  @Mutation(() => Article, { description: 'Unfavorite an `Article`' })
  async unFavoriteArticle(
    @MyUser('id') userId: number,
    @Args('input') input: UnFavoriteArticleInput,
  ): Promise<Article> {
    return this.articleService.unFavorite(userId, input);
  }

  // -------------------------------------------------------------------------
  // Subscriptions (real time queries related to this entity)
  // -------------------------------------------------------------------------
}
