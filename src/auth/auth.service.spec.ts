import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import {
	ConflictException,
	UnauthorizedException,
	ForbiddenException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
	let service: AuthService;
	let prismaService: PrismaService;
	let jwtService: JwtService;

	const mockPrismaService = {
		user: {
			findUnique: jest.fn(),
			create: jest.fn(),
		},
		role: {
			findFirst: jest.fn(),
		},
		passwordHistory: {
			create: jest.fn(),
		},
	};

	const mockJwtService = {
		signAsync: jest.fn(),
		verifyAsync: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: PrismaService,
					useValue: mockPrismaService,
				},
				{
					provide: JwtService,
					useValue: mockJwtService,
				},
			],
		}).compile();

		service = module.get<AuthService>(AuthService);
		prismaService = module.get<PrismaService>(PrismaService);
		jwtService = module.get<JwtService>(JwtService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('register', () => {
		const registerDto = {
			email: 'test@test.com',
			password: 'password123',
			name: 'Test User',
		};

		it('should register a new user successfully', async () => {
			const hashedPassword = 'hashedPassword';
			const roleId = '1';
			const userId = '1';

			mockPrismaService.user.findUnique.mockResolvedValue(null);
			mockPrismaService.role.findFirst.mockResolvedValue({ id: roleId });
			(bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
			mockPrismaService.user.create.mockResolvedValue({
				id: userId,
				...registerDto,
				password: hashedPassword,
				roleId,
			});
			mockJwtService.signAsync.mockResolvedValueOnce('accessToken');
			mockJwtService.signAsync.mockResolvedValueOnce('refreshToken');

			const result = await service.register(registerDto);

			expect(result).toEqual({
				user: {
					id: userId,
					email: registerDto.email,
					name: registerDto.name,
				},
				accessToken: 'accessToken',
				refreshToken: 'refreshToken',
			});
		});

		it('should throw ConflictException if email already exists', async () => {
			mockPrismaService.user.findUnique.mockResolvedValue({ id: '1' });

			await expect(service.register(registerDto)).rejects.toThrow(
				ConflictException,
			);
		});
	});

	describe('login', () => {
		const loginDto = {
			email: 'test@test.com',
			password: 'password123',
		};

		it('should login successfully with correct credentials', async () => {
			const user = {
				id: '1',
				email: loginDto.email,
				password: 'hashedPassword',
				name: 'Test User',
			};

			mockPrismaService.user.findUnique.mockResolvedValue(user);
			(bcrypt.compare as jest.Mock).mockResolvedValue(true);
			mockJwtService.signAsync.mockResolvedValueOnce('accessToken');
			mockJwtService.signAsync.mockResolvedValueOnce('refreshToken');

			const result = await service.login(loginDto);

			expect(result).toEqual({
				user: {
					id: user.id,
					email: user.email,
					name: user.name,
				},
				accessToken: 'accessToken',
				refreshToken: 'refreshToken',
			});
		});

		it('should throw UnauthorizedException if user not found', async () => {
			mockPrismaService.user.findUnique.mockResolvedValue(null);

			await expect(service.login(loginDto)).rejects.toThrow(
				UnauthorizedException,
			);
		});

		it('should throw UnauthorizedException if password is incorrect', async () => {
			mockPrismaService.user.findUnique.mockResolvedValue({ id: '1' });
			(bcrypt.compare as jest.Mock).mockResolvedValue(false);

			await expect(service.login(loginDto)).rejects.toThrow(
				UnauthorizedException,
			);
		});
	});

	describe('refreshTokens', () => {
		it('should refresh tokens successfully', async () => {
			const userId = '1';
			const refreshToken = 'validRefreshToken';
			const user = {
				id: userId,
				email: 'test@test.com',
			};

			mockPrismaService.user.findUnique.mockResolvedValue(user);
			mockJwtService.verifyAsync.mockResolvedValue({ sub: userId });
			mockJwtService.signAsync.mockResolvedValueOnce('newAccessToken');
			mockJwtService.signAsync.mockResolvedValueOnce('newRefreshToken');

			const result = await service.refreshTokens(userId, refreshToken);

			expect(result).toEqual({
				accessToken: 'newAccessToken',
				refreshToken: 'newRefreshToken',
			});
		});

		it('should throw ForbiddenException if user not found', async () => {
			mockPrismaService.user.findUnique.mockResolvedValue(null);

			await expect(service.refreshTokens('1', 'token')).rejects.toThrow(
				ForbiddenException,
			);
		});

		it('should throw ForbiddenException if refresh token is invalid', async () => {
			mockPrismaService.user.findUnique.mockResolvedValue({ id: '1' });
			mockJwtService.verifyAsync.mockRejectedValue(new Error());

			await expect(service.refreshTokens('1', 'invalidToken')).rejects.toThrow(
				ForbiddenException,
			);
		});
	});
});
