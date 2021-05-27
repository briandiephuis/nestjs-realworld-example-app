// import { Controller, Delete, Get, HttpCode, Param, Post } from '@nestjs/common';

// import { IProfileRO } from './profile.interface';
// import { ProfileService } from './profile.service';

// @Controller('profiles')
// export class ProfileResolver {
//   constructor(private readonly profileService: ProfileService) {}

//   // -------------------------------------------------------------------------
//   // Resolve fields (extend fields on the entity)
//   // -------------------------------------------------------------------------

//   // -------------------------------------------------------------------------
//   // Queries (root queries for this entity, queries should not mutate data)
//   // -------------------------------------------------------------------------

//   @Query(() => Profile)
//   async myProfile(
//     @MyUser('id') userId: number,
//     @Param('username') username: string,
//   ): Promise<IProfileRO> {
//     return this.profileService.findProfile(userId, username);
//   }

//   @Post(':username/follow')
//   @HttpCode(200)
//   async follow(
//     @MyUser('email') email: string,
//     @Param('username') username: string,
//   ): Promise<IProfileRO> {
//     return this.profileService.follow(email, username);
//   }

//   @Delete(':username/follow')
//   async unFollow(
//     @MyUser('id') userId: number,
//     @Param('username') username: string,
//   ): Promise<IProfileRO> {
//     return this.profileService.unFollow(userId, username);
//   }
// }
