/* eslint-disable @typescript-eslint/ban-types */
import { RequestContext } from '@mikro-orm/core';
import DataLoader from 'dataloader';

import { AppRequest } from '../typings/AppRequest';
import { dict } from './dict.helper';

export declare type ObjectType<T> =
  | {
      new (): T;
    }
  | Function;

interface BatchLoadOneOptions<T> {
  key?: keyof T;
  // andWhere?: FindConditions<T>;
  // query?: (ids: readonly string[], req?: AppRequest) => Promise<T[]>;
}

interface BatchLoadManyOptions<T> extends BatchLoadOneOptions<T> {
  order?: {
    [P in keyof T]?: 'ASC' | 'DESC';
  };
}

export const LoadMany =
  <T>(
    entity: ObjectType<T>,
    options?: BatchLoadManyOptions<T>,
  ): ((req?: AppRequest) => DataLoader<number, T[], number>) =>
  (req): DataLoader<number, T[], number> =>
    new DataLoader(async (ids: number[]): Promise<T[][]> => {
      const key = options?.key ?? ('id' as keyof T);
      const entities = await RequestContext.getEntityManager().find(entity, { [key]: { $in: ids } });
      if (entities.length === 0) return [[]]; // Performance optimization, don't need to create a dictionary and map it if the array is empty
      const keyToEntities = dict<T>(entities, key);
      return ids.map((id) => keyToEntities[id] ?? []); // Default to an empty array for each 'load'
    });
