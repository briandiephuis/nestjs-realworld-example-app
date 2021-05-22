import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { AppResolver } from './app.resolver';
import { ArticleModule } from './article/article.module';
import { ProfileModule } from './profile/profile.module';
import { TagModule } from './tag/tag.module';
import { UserModule } from './user/user.module';
import { AppRequest } from './shared/typings/AppRequest';
import { GraphQLModule } from '@nestjs/graphql';
import { Response } from 'express';
import { ConnectionContext } from 'subscriptions-transport-ws';

@Module({
  controllers: [],
  imports: [
    MikroOrmModule.forRoot(),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      sortSchema: true, // Minimize git changes -> schema is mainly generated for documentation & code reviews
      context: ({
        req,
        res,
        connection,
      }: {
        req: AppRequest;
        res: Response;
        connection: ConnectionContext;
      }) => ({
        connection,
        // loaders: createLoaders(req),
        req,
        res,
      }),
      cors: false, // Cors should be handled by NestJS, not the Apollo Server
      debug: process.env.NODE_ENV !== 'production',
      playground: process.env.NODE_ENV !== 'production',
      tracing: false,
      fieldResolverEnhancers: ['interceptors'],
    }),
    ArticleModule,
    UserModule,
    ProfileModule,
    TagModule,
  ],
  providers: [AppResolver],
})
export class AppModule {}
