import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { User } from '@prisma/client';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserService {
	constructor(private readonly prisma: PrismaService) {}

	private async checkPasswordHistory(
		userId: string,
		newPassword: string,
	): Promise<void> {
		const recentPasswords = await this.prisma.passwordHistory.findMany({
			where: { userId },
			orderBy: { createdAt: 'desc' },
			take: 5,
		});

		for (const historicPassword of recentPasswords) {
			const isMatch = await bcrypt.compare(
				newPassword,
				historicPassword.password,
			);
			if (isMatch) {
				throw new BadRequestException(
					'Password has been used recently. Please choose a different password.',
				);
			}
		}
	}

	async create(createUserDto: CreateUserDto) {
		const existingUser = await this.prisma.user.findUnique({
			where: { email: createUserDto.email },
		});

		if (existingUser) {
			throw new ConflictException('Email already registered');
		}

		const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

		return this.prisma.$transaction(async (prisma) => {
			const user = await prisma.user.create({
				data: {
					email: createUserDto.email,
					name: createUserDto.name,
					password: hashedPassword,
				},
				select: {
					id: true,
					email: true,
					name: true,
					role: {
						select: {
							id: true,
							name: true,
						},
					},
					createdAt: true,
					updatedAt: true,
				},
			});

			await prisma.passwordHistory.create({
				data: {
					userId: user.id,
					password: hashedPassword,
				},
			});

			return user;
		});
	}

	async findAll(
		pageOptions: PageOptionsDto,
	): Promise<PageDto<UserResponseDto>> {
		const [users, itemCount] = await Promise.all([
			this.prisma.user.findMany({
				skip: pageOptions.skip,
				take: pageOptions.take,
				orderBy: {
					createdAt: pageOptions.order,
				},
				select: {
					id: true,
					email: true,
					name: true,
					role: {
						select: {
							id: true,
							name: true,
						},
					},
					createdAt: true,
					updatedAt: true,
				},
			}),
			this.prisma.user.count(),
		]);

		const pageMetaDto = new PageMetaDto({ itemCount, pageOptions });

		return new PageDto(users, pageMetaDto);
	}

	async findOne(id: string): Promise<UserResponseDto> {
		const user = await this.prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				email: true,
				name: true,
				role: {
					select: {
						id: true,
						name: true,
					},
				},
				createdAt: true,
				updatedAt: true,
			},
		});

		if (!user) {
			throw new NotFoundException('User not found');
		}

		return user;
	}

	async update(id: string, updateUserDto: UpdateUserDto) {
		await this.findOne(id);

		if (updateUserDto.email) {
			const existingUser = await this.prisma.user.findUnique({
				where: { email: updateUserDto.email },
			});

			if (existingUser && existingUser.id !== id) {
				throw new ConflictException('Email already registered');
			}
		}

		if (updateUserDto.password) {
			await this.checkPasswordHistory(id, updateUserDto.password);

			updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);

			await this.prisma.passwordHistory.create({
				data: {
					userId: id,
					password: updateUserDto.password,
				},
			});
		}

		return this.prisma.user.update({
			where: { id },
			data: updateUserDto,
			select: {
				id: true,
				email: true,
				name: true,
				role: {
					select: {
						id: true,
						name: true,
					},
				},
				createdAt: true,
				updatedAt: true,
			},
		});
	}

	async remove(id: string) {
		await this.findOne(id);

		return this.prisma.user.delete({
			where: { id },
			select: {
				id: true,
				email: true,
				name: true,
				createdAt: true,
				updatedAt: true,
			},
		});
	}
}
