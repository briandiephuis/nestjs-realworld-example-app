import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';
import { Tag } from './tag.entity';
import { TagResolver } from './tag.resolver';
import { TagService } from './tag.service';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [Tag] }), UserModule],
  providers: [TagResolver, TagService],
})
export class TagModule {}
