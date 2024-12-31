import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
	imports: [
		PrismaModule,
		PassportModule,
		JwtModule.register({
			secret: process.env.JWT_ACCESS_SECRET,
			signOptions: { expiresIn: '15m' },
		})
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		JwtStrategy,
		JwtRefreshStrategy,
	],
	exports: [AuthService],
})
export class AuthModule {}
