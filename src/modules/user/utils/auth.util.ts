import { sign, verify } from 'jsonwebtoken';

import { JWT_ALGORITHM, JWT_ISSUER, JWT_SECRET } from '../../../config';

/**
 * All properties are marked as unknown and optional to prevent false assumptions since the payload
 * of the token is unknown.
 */
export interface JwtUser {
  /** unique identifier of the `User` */
  id?: number | unknown;
  aud?: string | unknown;
  iat?: number | unknown;
  exp?: number | unknown;
  iss?: string | unknown;
}

export const signJwt = (
  /** unique identifier of the `User` */
  id: number,
  /** expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms.js).  Eg: 60, "2 days", "10h", "7d" */
  expiresIn: string | number,
  /** JWT type (short lived access token to fetch data or a refresh token to get new tokens) */
  type: 'access' | 'refresh' = 'access',
): string => {
  return sign({ id }, JWT_SECRET, {
    expiresIn,
    issuer: JWT_ISSUER,
    audience: type === 'refresh' ? 'r' : 'a',
    algorithm: JWT_ALGORITHM,
  });
};

export const verifyJwt = (token: string, type: 'access' | 'refresh' = 'access'): JwtUser =>
  verify(token, JWT_SECRET, {
    algorithms: [JWT_ALGORITHM],
    issuer: JWT_ISSUER,
    audience: type === 'refresh' ? 'r' : 'a',
  }) as JwtUser;
