import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Logger,
  Post,
  Request,
  Response,
  UnauthorizedException,
} from '@nestjs/common';
import { compareSync } from 'bcryptjs';
import { CookieOptions, Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { ACCESS_TOKEN_EXPIRY, REFRESH_COOKIE_PROPERTY, REFRESH_TOKEN_EXPIRY } from '../../config';
import { SignInDto } from './dto/signIn.dto';
import { SignInPayload } from './models/sign-in.model';
import { UserRepository } from './user.repository';
import { JwtUser, signJwt, verifyJwt } from './utils/auth.util';

@Controller('auth')
export class AuthController {
  logger = new Logger(AuthController.name);

  private readonly cookieSettings: CookieOptions = {
    httpOnly: true, // Do not give JS access to this cookie to prevent XSS attacks
    path: 'auth', // Explicitly set the path of this controller so it won't be sent on each `/graphql` request
    secure: process.env.NODE_ENV === 'production', // SSL/TLS might not be available in the development environment
    sameSite: 'strict',
  };

  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Sign in by providing valid user credentials (email and password combination)
   */
  @Post('/')
  public async signIn(
    @Response() res: ExpressResponse,
    @Body() body?: SignInDto,
  ): Promise<ExpressResponse<SignInPayload>> {
    // Verify credentials and check if user is not blocked
    if (!body?.email || !body?.password) {
      throw new BadRequestException('Email and password fields are mandatory without a refresh token');
    }

    // Fetch user from db
    const user = await this.userRepository.findOne({ email: body.email });
    // Throw an error if the user was not found (meaning the email was invalid) or if the password hash-compare fails
    if (!user || !compareSync(body.password, user.password)) {
      throw new ForbiddenException('Invalid credentials');
    }
    // if (user.is_blocked) throw new ForbiddenException('User is blocked');

    const accessToken = signJwt(user.id, ACCESS_TOKEN_EXPIRY, 'access');
    const refreshToken = signJwt(user.id, REFRESH_TOKEN_EXPIRY, 'refresh');

    res.cookie(REFRESH_COOKIE_PROPERTY, refreshToken, {
      ...this.cookieSettings,
      maxAge: REFRESH_TOKEN_EXPIRY * 1000, // convert from sec. to ms
    });

    return res.send(new SignInPayload(accessToken));
  }

  /**
   * Provides the user a new short-lived access-token based on a longer lived refresh token. This
   * will automatically update the refresh token to extend its lifetime.
   */
  @Post('/refresh')
  public async refresh(
    @Request() req: ExpressRequest,
    @Response() res: ExpressResponse,
  ): Promise<ExpressResponse<SignInPayload>> {
    const payload = this.validateRefreshToken(req);

    // Get user information for the authenticated user
    if (!payload.iat || typeof payload.iat !== 'number' || typeof payload.id !== 'number') {
      throw new ForbiddenException('Invalid refresh token');
    }

    // const iat = new Date(payload.iat * 1000).toUTCString(); // Convert to milliseconds, then parse to a date and get the UTC string value for the timestamp
    const user = await this.userRepository.findOne(payload.id);
    if (!user) throw new ForbiddenException('User not found');

    // Was the refresh token generated after the latest forced sign-out (or password reset)
    // if (user.is_invalidated)
    //   throw new ForbiddenException(
    //     'Refresh token was invalidated, sign in again.',
    //   );
    // if (user.is_blocked) throw new ForbiddenException('User is blocked');

    const accessToken = signJwt(user.id, ACCESS_TOKEN_EXPIRY, 'access');
    const refreshToken = signJwt(user.id, REFRESH_TOKEN_EXPIRY, 'refresh');

    res.cookie(REFRESH_COOKIE_PROPERTY, refreshToken, {
      ...this.cookieSettings,
      maxAge: REFRESH_TOKEN_EXPIRY,
    });

    return res.send(new SignInPayload(accessToken));
  }

  /**
   * User sign out by clearing the http-only cookie that holds the refresh token to prevent future
   * refreshes of the access-token on the client.
   */
  @Post('/sign-out')
  public async signOut(
    @Request() req: ExpressRequest,
    @Response() res: ExpressResponse,
  ): Promise<ExpressResponse<never>> {
    this.validateRefreshToken(req); // The content of the payload is not needed here

    res.clearCookie(REFRESH_COOKIE_PROPERTY, this.cookieSettings);

    return res.status(200).send();
  }

  /**
   * Global (forces) sign out for this user on all devices based on a refresh token.
   */
  @Post('/force-sign-out')
  public async forceSignOut(
    @Request() req: ExpressRequest,
    @Response() res: ExpressResponse,
  ): Promise<ExpressResponse<SignInPayload>> {
    this.validateRefreshToken(req);
    // const payload = this.validateRefreshToken(req);

    // Set the current time as token_invalidated_at timestamp to invalidate all previously generated refresh tokens
    // `UPDATE user SET token_invalidated_at = NOW() WHERE uid = $1`

    res.clearCookie(REFRESH_COOKIE_PROPERTY, this.cookieSettings);

    return res.status(200).send();
  }

  /**
   * Gets the refresh token from the http-only cookie, verifies it and returns the payload as a
   * `Partial<JwtUser>` to prevent false assumptions about the payload properties.
   */
  private validateRefreshToken(req: ExpressRequest): Partial<JwtUser> {
    const currentRefreshToken: string | undefined = req.cookies?.[REFRESH_COOKIE_PROPERTY];

    // Check if token is provided
    if (!currentRefreshToken) throw new UnauthorizedException('No refresh token found');

    // Verify token
    let payload: Partial<JwtUser>; // Partial to make sure no false assumptions are made about properties
    try {
      payload = verifyJwt(currentRefreshToken, 'refresh');
    } catch (error) {
      this.logger.warn(error);
      throw new ForbiddenException('Invalid refresh token', error);
    }
    return payload;
  }
}
