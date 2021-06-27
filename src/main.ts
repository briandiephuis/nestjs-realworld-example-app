import { NestApplicationOptions } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { json as bodyParserJson } from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const appOptions: NestApplicationOptions = { cors: true };
  const app = await NestFactory.create(AppModule, appOptions);

  // Inline Express middleware, should be equivalent to MikroOrmRequestContextMiddleware
  // app.use((req: Request, res: Response, next: NextFunction) => RequestContext.create(app.get(MikroORM).em, next));

  app.use(bodyParserJson());
  app.use(cookieParser()); // Parse the `/auth` refresh cookie
  app.use(compression()); // GQL output can get quite long, luckily it compresses well
  app.use(helmet()); // Set sensible headers for improved security

  await app.listen(8000);
}

// Let the server fail if it fails. Server management (e.g. Kubernetes) should know this and handle
// accordingly (i.e. restart it)
bootstrap();
