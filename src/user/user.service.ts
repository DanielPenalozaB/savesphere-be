import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async create(data: CreateUserDto) {
		return this.prisma.user.create({
			data,
		});
	}

	async findAll() {
		return this.prisma.user.findMany();
	}

	async findOne(id: string) {
		return this.prisma.user.findUnique({
			where: { id },
		});
	}

	async update(id: string, data: UpdateUserDto) {
		return this.prisma.user.update({
			where: { id },
			data,
		});
	}

	async remove(id: string) {
		return this.prisma.user.delete({
			where: { id },
		});
	}
}