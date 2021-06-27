import { wrap } from '@mikro-orm/core';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { validate } from 'class-validator';

import { CreateUserInput } from './dto/create-user.dto';
import { DeleteUserInput } from './dto/delete-user.dto';
import { UpdateMyUserInput } from './dto/update-my-user.dto';
import { DeletedUser } from './models/deleted-user.model';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async create({ username, email, password }: CreateUserInput): Promise<User> {
    // check uniqueness of username/email
    const exists = await this.userRepository.count({
      $or: [{ username }, { email }],
    });

    if (exists > 0) {
      throw new HttpException(
        {
          message: 'Input data validation failed',
          errors: { username: 'Username and email must be unique.' },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // create new user
    const user = new User(username, email, password);
    const errors = await validate(user);

    if (errors.length > 0) {
      throw new HttpException(
        {
          message: 'Input data validation failed',
          errors: { username: 'User input is not valid.' },
        },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      await this.userRepository.persistAndFlush(user);
      return user;
    }
  }

  async update(userId: number, input: UpdateMyUserInput): Promise<User> {
    const user = await this.userRepository.findOneOrFail(userId);
    wrap(user).assign(input);
    await this.userRepository.flush();

    return user;
  }

  async delete(input: DeleteUserInput): Promise<DeletedUser> {
    const user = await this.userRepository.findOneOrFail({
      id: input.userId,
    });
    const deletedUser: DeletedUser = {
      deletedUserId: user.id,
    };
    await this.userRepository.removeAndFlush(user);
    return deletedUser;
  }

  async findById(id: number, populate?: any[]): Promise<User> {
    const user = await this.userRepository.findOne(id, populate);

    if (!user) {
      const errors = { User: ' not found' };
      throw new HttpException({ errors }, 401);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneOrFail({ email });
    return user;
  }
}
