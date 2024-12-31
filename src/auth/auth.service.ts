import {
	ConflictException,
	ForbiddenException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { authenticator } from 'otplib';
import * as qrcode from 'qrcode';

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService,
	) {}

	async register(dto: RegisterDto) {
		const existingUser = await this.prisma.user.findUnique({
			where: { email: dto.email },
		});

		if (existingUser) {
			throw new ConflictException('Email already registered');
		}

		const role = await this.prisma.role.findFirst({
			where: { name: 'USER' },
		});

		const hashedPassword = await bcrypt.hash(dto.password, 10);

		const user = await this.prisma.user.create({
			data: {
				email: dto.email,
				password: hashedPassword,
				name: dto.name,
				roleId: role.id,
			},
		});

		await this.prisma.passwordHistory.create({
			data: {
				userId: user.id,
				password: hashedPassword,
			},
		});

		const tokens = await this.generateTokens(user.id, user.email);

		return {
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
			},
			...tokens,
		};
	}

	async generate2faSecret(userId: string) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
		});

		if (!user) {
			throw new UnauthorizedException('User not found');
		}

		// Generate a secret
		const secret = authenticator.generateSecret();

		// Save the secret to the user
		await this.prisma.user.update({
			where: { id: userId },
			data: { twoFactorSecret: secret },
		});

		// Generate otpauth URL for QR code
		const otpauthUrl = authenticator.keyuri(
			user.email,
			'YOUR_APP_NAME',
			secret,
		);

		// Generate QR code
		const qrCodeDataUrl = await qrcode.toDataURL(otpauthUrl);

		return {
			secret,
			qrCodeDataUrl,
		};
	}

	async enable2fa(userId: string, code: string) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
		});

		if (!user || !user.twoFactorSecret) {
			throw new UnauthorizedException('Invalid user or 2FA not initialized');
		}

		// Verify the code
		const isCodeValid = authenticator.verify({
			token: code,
			secret: user.twoFactorSecret,
		});

		if (!isCodeValid) {
			throw new UnauthorizedException('Invalid 2FA code');
		}

		// Enable 2FA
		await this.prisma.user.update({
			where: { id: userId },
			data: { twoFactorEnabled: true },
		});

		return { message: '2FA enabled successfully' };
	}

	async verify2fa(userId: string, code: string) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
		});

		if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
			throw new UnauthorizedException('2FA is not enabled for this user');
		}

		const isCodeValid = authenticator.verify({
			token: code,
			secret: user.twoFactorSecret,
		});

		if (!isCodeValid) {
			throw new UnauthorizedException('Invalid 2FA code');
		}

		return { verified: true };
	}

	async login(dto: LoginDto) {
		const user = await this.prisma.user.findUnique({
			where: { email: dto.email },
		});

		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}

		const isPasswordValid = await bcrypt.compare(dto.password, user.password);

		if (!isPasswordValid) {
			throw new UnauthorizedException('Invalid credentials');
		}

		if (user.twoFactorEnabled) {
			const tempToken = await this.jwtService.signAsync(
				{
					sub: user.id,
					email: user.email,
					requires2fa: true,
				},
				{
					secret: process.env.JWT_ACCESS_SECRET,
					expiresIn: '5m',
				},
			);

			return {
				requires2fa: true,
				tempToken,
			};
		}

		const tokens = await this.generateTokens(user.id, user.email);

		return {
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
			},
			...tokens,
		};
	}

	async refreshTokens(userId: string, refreshToken: string) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
		});

		if (!user) {
			throw new ForbiddenException('Access denied');
		}

		try {
			await this.jwtService.verifyAsync(refreshToken, {
				secret: process.env.JWT_REFRESH_SECRET,
			});
		} catch {
			throw new ForbiddenException('Invalid refresh token');
		}

		const tokens = await this.generateTokens(user.id, user.email);
		return tokens;
	}

	private async generateTokens(userId: string, email: string) {
		const [accessToken, refreshToken] = await Promise.all([
			this.jwtService.signAsync(
				{
					sub: userId,
					email,
				},
				{
					secret: process.env.JWT_ACCESS_SECRET,
					expiresIn: '15m',
				},
			),
			this.jwtService.signAsync(
				{
					sub: userId,
					email,
				},
				{
					secret: process.env.JWT_REFRESH_SECRET,
					expiresIn: '7d',
				},
			),
		]);

		return {
			accessToken,
			refreshToken,
		};
	}
}
