import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { MyUser } from '../../decorators/my-user.decorator';
import { CreateUserInput } from './dto/create-user.dto';
import { DeleteUserInput } from './dto/delete-user.dto';
import { UpdateMyUserInput } from './dto/update-my-user.dto';
import { DeletedUser } from './models/deleted-user.model';
import { User } from './user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  // -------------------------------------------------------------------------
  // Resolve fields (extend fields on the entity)
  // -------------------------------------------------------------------------

  // @ResolveField(() => [Article], { description: '`Articles` written by this `User`' })

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

  // @UsePipes(new ValidationPipe())
  // @Post('users/login')
  // async login(@Body('user') loginUserDto: LoginUserDto): Promise<IUserRO> {
  //   const foundUser = await this.userService.findOne(loginUserDto);

  //   const errors = { User: ' not found' };
  //   if (!foundUser) {
  //     throw new HttpException({ errors }, 401);
  //   }
  //   const token = await this.userService.generateJWT(foundUser);
  //   const { email, username, bio, image } = foundUser;
  //   const user = { email, token, username, bio, image };
  //   return { user };
  // }

  // -------------------------------------------------------------------------
  // Subscriptions (real time queries related to this entity)
  // -------------------------------------------------------------------------
}
