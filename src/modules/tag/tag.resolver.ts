import { Query, Resolver } from '@nestjs/graphql';

import { Tag } from './tag.entity';
import { TagService } from './tag.service';

@Resolver(() => Tag)
export class TagResolver {
  constructor(private readonly tagService: TagService) {}

  @Query(() => [Tag], { description: 'Get all `Tags`' })
  async tags(): Promise<Tag[]> {
    return this.tagService.findAll();
  }
}
