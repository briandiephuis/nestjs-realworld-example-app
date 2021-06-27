import { Collection, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { Comment } from '../comment/comment.entity';
import { User } from '../user/user.entity';
import { Article } from './article.entity';
import { ArticleInput } from './dto/article.dto';
import { CreateArticleInput } from './dto/create-article.dto';
import { DeleteArticleInput } from './dto/delete-article.dto';
import { FavoriteArticleInput } from './dto/favorite-article.dto';
import { UnFavoriteArticleInput } from './dto/un-favorite-article.dto';
import { UpdateArticleInput } from './dto/update-article.dto';
import { DeletedArticle } from './models/deleted-article.model';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: EntityRepository<Article>,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async findByAuthorId(userId: number): Promise<Article[]> {
    return this.articleRepository.find({ authorId: userId });
  }

  // async findAll(userId: number, query: any): Promise<IArticlesRO> {
  //   const user = userId
  //     ? await this.userRepository.findOne(userId, ['followers', 'favorites'])
  //     : undefined;
  //   const qb = this.articleRepository
  //     .createQueryBuilder('a')
  //     .select('a.*')
  //     .leftJoin('a.author', 'u');

  //   if ('tag' in query) {
  //     qb.andWhere({ tagList: new RegExp(query.tag) });
  //   }

  //   if ('author' in query) {
  //     const author = await this.userRepository.findOne({
  //       username: query.author,
  //     });

  //     if (!author) {
  //       return { articles: [], articlesCount: 0 };
  //     }

  //     qb.andWhere({ author: author.id });
  //   }

  //   if ('favorited' in query) {
  //     const author = await this.userRepository.findOne({
  //       username: query.favorited,
  //     });

  //     if (!author) {
  //       return { articles: [], articlesCount: 0 };
  //     }

  //     const ids = author.favorites.getIdentifiers();
  //     qb.andWhere({ author: ids });
  //   }

  //   qb.orderBy({ createdAt: QueryOrder.DESC });
  //   const res = await qb.clone().count('id', true).execute('get');
  //   const articlesCount = res.count;

  //   if ('limit' in query) {
  //     qb.limit(query.limit);
  //   }

  //   if ('offset' in query) {
  //     qb.offset(query.offset);
  //   }

  //   const articles = await qb.getResult();

  //   return { articles: articles.map((a) => a.toJSON(user)), articlesCount };
  // }

  // async findFeed(userId: number, query): Promise<IArticlesRO> {
  //   const user = userId
  //     ? await this.userRepository.findOne(userId, ['followers', 'favorites'])
  //     : undefined;
  //   const res = await this.articleRepository.findAndCount(
  //     { author: { followers: userId } },
  //     {
  //       populate: ['author'],
  //       orderBy: { createdAt: QueryOrder.DESC },
  //       limit: query.limit,
  //       offset: query.offset,
  //     },
  //   );

  //   return {
  //     articles: res[0].map((a) => a.toJSON(user)),
  //     articlesCount: res[1],
  //   };
  // }

  async findOne({ slug }: ArticleInput): Promise<Article> {
    const article = await this.articleRepository.findOne({ slug }, ['author']);
    return article;
  }

  async favorite(myUserId: number, { slug }: FavoriteArticleInput): Promise<Article> {
    const article = await this.articleRepository.findOneOrFail({ slug }, ['author']);
    const user = await this.userRepository.findOneOrFail(myUserId, ['favorites', 'followers']);

    if (!user.favorites.contains(article)) {
      user.favorites.add(article);
      article.favoritesCount++;
    }

    await this.articleRepository.flush();
    return article;
  }

  async unFavorite(myUserId: number, { slug }: UnFavoriteArticleInput): Promise<Article> {
    const article = await this.articleRepository.findOneOrFail({ slug }, ['author']);
    const user = await this.userRepository.findOneOrFail(myUserId, ['followers', 'favorites']);

    if (user.favorites.contains(article)) {
      user.favorites.remove(article);
      article.favoritesCount--;
    }

    await this.articleRepository.flush();
    return article;
  }

  async findComments(slug: string): Promise<Collection<Comment, unknown>> {
    const article = await this.articleRepository.findOne({ slug }, ['comments']);
    return article.comments;
  }

  async create(userId: number, input: CreateArticleInput): Promise<Article> {
    const user = await this.userRepository.findOne({ id: userId }, ['followers', 'favorites', 'articles']);
    const article = new Article(user, input.title, input.description, input.body);
    article.tagList.push(...input.tagList);
    user.articles.add(article);
    await this.userRepository.flush();

    return article;
  }

  async update({ slug, ...input }: UpdateArticleInput): Promise<Article> {
    const article = await this.articleRepository.findOne({ slug }, ['author']);
    wrap(article).assign(input);
    await this.articleRepository.flush();

    return article;
  }

  async delete({ slug }: DeleteArticleInput): Promise<DeletedArticle> {
    const article = await this.articleRepository.findOneOrFail({ slug });
    const deletedArticle: DeletedArticle = {
      deletedArticleId: article.id,
    };
    await this.articleRepository.removeAndFlush(article);
    return deletedArticle;
  }
}
