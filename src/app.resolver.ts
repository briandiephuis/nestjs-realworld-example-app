import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
  @Query(() => String)
  root(): string {
    return 'Hello World!';
  }
}
