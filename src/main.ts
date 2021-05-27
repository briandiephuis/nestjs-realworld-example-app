import { NestApplicationOptions } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const appOptions: NestApplicationOptions = { cors: true };
  const app = await NestFactory.create(AppModule, appOptions);

  app.use(cookieParser()); // Parse the `/auth` refresh cookie
  app.use(compression()); // GQL output can get quite long, luckily it compresses well
  app.use(helmet()); // Set sensible headers for improved security

  await app.listen(8000);
}

bootstrap();
