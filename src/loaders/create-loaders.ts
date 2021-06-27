import { Article } from '../modules/article/article.entity';
import { AppRequest } from '../typings/AppRequest';
import { LoadMany } from './loaders.helper';

/**
 * Create DataLoaders scoped to the request
 *
 * Get access to the created loaders via the Loaders() decorator:
 *
 * ```ts
 * _@ResolveField(() => [Article], { description: '`Articles` written by this `User`' })
 *   async articles(@Parent() parent: User, @Loaders() { userArticles }: LoadersType): Promise<Article[]> {
 *   return userArticles.load(parent.id);
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createLoaders = (req: AppRequest) => ({
  userArticles: LoadMany(Article, { key: 'authorId' })(req),
});
