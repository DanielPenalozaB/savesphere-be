import { Body, Controller, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { TwoFactorAuthService } from 'src/2fa/2fa.service';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { RefreshTokenGuard } from './guard/refresh-token.guard';
import { IAuthenticatedUser } from './interface/authenticated-user.interface';

@Controller('auth')
export class AuthController {
  constructor(
		private readonly authService: AuthService,
    private readonly twoFactorAuthService: TwoFactorAuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
	@ApiOperation({ tags: ['auth'], summary: 'Register a new user' })
	@ApiResponse({ status: 201, description: 'User registered successfully' })
	@ApiResponse({ status: 409, description: 'Email already registered' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
	@Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(LocalAuthGuard)
	@ApiOperation({ tags: ['auth'], summary: 'Login' })
	@ApiResponse({ status: 200, description: 'User logged in successfully' })
	@ApiResponse({ status: 401, description: 'Invalid credentials' })
	@ApiBody({
	  schema: {
	    type: 'object',
	    properties: {
	      email: { type: 'string' },
	      password: { type: 'string' },
	    },
	  },
	})
	@Post('login')
  login(@Body() loginDto: LoginDto) {
	  return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ tags: ['auth'], summary: 'Verify 2FA token for the logged-in user.' })
  @ApiBody({ schema: { example: { token: '123456' } } })
  @ApiResponse({
    status: 200,
    description: 'Successful 2FA login',
    schema: { example: { access_token: 'string' } },
  })
  @ApiResponse({ status: 401, description: 'Invalid 2FA token' })
	@Post('2fa/verify')
  loginWith2FA(@Req() request: Request, @Body('token') token: string) {
    const user = request.user as IAuthenticatedUser;
    return this.authService.loginWith2FA(user, token);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ tags: ['auth'], summary: 'Setup 2FA for the logged-in user' })
  @ApiResponse({
    status: 200,
    description: '2FA setup successfully',
    schema: { example: { otpauthUrl: 'string' } },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('2fa/setup')
  async setup2FA(@Req() request: Request) {
    const user = request.user as IAuthenticatedUser;
    const secret = this.twoFactorAuthService.generateSecret();
    const otpauthUrl = await this.twoFactorAuthService.generateQRCode(secret, user.email);

    await this.authService.updateTwoFactorSecret(user.id, secret);

    return { otpauthUrl };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ tags: ['auth'], summary: 'Confirm 2FA setup for the logged-in user' })
  @ApiResponse({ status: 200, description: '2FA setup confirmed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('2fa/confirm')
  async confirm2FA(@Req() request: Request, @Body('token') token: string) {
    const user = request.user as IAuthenticatedUser;
    const isValid = this.twoFactorAuthService.verifyToken(token, user.twoFactorSecret);

    if (!isValid) {
      throw new UnauthorizedException('Invalid 2FA token');
    }

    await this.authService.confirmTwoFactorSetup(user.id);
    const tokens = this.authService.generateTokens(user.id, user.email);

    return { message: '2FA setup confirmed successfully', tokens };
  }

	@UseGuards(RefreshTokenGuard)
	@ApiOperation({ tags: ['auth'], summary: 'Refresh access and refresh tokens' })
	@ApiResponse({ status: 200, description: 'Tokens refreshed successfully' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@Post('refresh')
  refreshTokens(@Req() req: Request) {
	  if (!req.user) {
	    throw new Error('No user from request');
	  }

	  const userId = req.user['sub'];
	  const refreshToken = req.user['refreshToken'];
	  return this.authService.refreshTokens(userId, refreshToken);
  }
}
