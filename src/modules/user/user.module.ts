import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { User } from './user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  controllers: [AuthController],
  exports: [UserService],
  imports: [MikroOrmModule.forFeature({ entities: [User] })],
  providers: [UserResolver, UserService],
})
export class UserModule {}
