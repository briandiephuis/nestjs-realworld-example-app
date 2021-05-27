import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { Response } from 'express';
import { ConnectionContext } from 'subscriptions-transport-ws';

import { AppResolver } from './app.resolver';
import { AuthMiddleware } from './middleware/auth.middleware';
import { ArticleModule } from './modules/article/article.module';
import { CommentModule } from './modules/comment/comment.module';
import { TagModule } from './modules/tag/tag.module';
import { UserModule } from './modules/user/user.module';
import { AppRequest } from './typings/AppRequest';

@Module({
  controllers: [],
  imports: [
    MikroOrmModule.forRoot(),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      sortSchema: true, // Minimize git changes -> schema is generated for documentation & code reviews
      context: ({ req, res, connection }: { req: AppRequest; res: Response; connection: ConnectionContext }) => ({
        // em: RequestContext.create(??orm.em, ??),
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
    CommentModule,
    UserModule,
    // ProfileModule,
    TagModule,
  ],
  providers: [AppResolver],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    // Apply the AuthMiddleware for all GraphQL requests to parse auth header
    // Guards and Interceptors can then further limit or allow access to
    // Queries, Mutations, Subscriptions and (Resolve)Fields
    consumer.apply(AuthMiddleware).forRoutes('graphql');
  }
}
