import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { createLoaders } from '../loaders/create-loaders';

export type LoadersType = ReturnType<typeof createLoaders>;

export const Loaders = createParamDecorator((_, ctx: ExecutionContext): LoadersType => ctx.getArgByIndex(2).loaders);
