import { EntityRepository, Repository } from '@mikro-orm/core';

import { Article } from './article.entity';

@Repository(Article)
export class ArticleRepository extends EntityRepository<Article> {}
