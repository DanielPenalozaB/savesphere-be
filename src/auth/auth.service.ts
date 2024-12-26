import {
	ConflictException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

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

	async refreshToken(refreshToken: string) {
		try {
			const payload = this.jwtService.verify(refreshToken, {
				secret: process.env.JWT_REFRESH_SECRET,
			});

			const tokens = await this.generateTokens(payload.sub, payload.email);

			return tokens;
		} catch (error) {
			throw new UnauthorizedException('Invalid refresh token');
		}
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
					expiresIn: '1m',
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
