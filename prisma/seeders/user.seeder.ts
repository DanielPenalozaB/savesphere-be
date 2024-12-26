import { PrismaClient } from '@prisma/client';
import { Seeder } from './types';

export class UserSeeder implements Seeder {
	async run(prisma: PrismaClient): Promise<void> {
		const existingUsers = await prisma.user.count();

		if (existingUsers > 0) {
			console.log('⚡ Users already seeded, skipping...');
			return;
		}

		const role = await prisma.role.findFirst({ where: { name: 'ADMIN' } });

		const users = [
			{
				name: 'SaveSphere',
				email: 'savesphere@app.com',
				password: '8XAY=PQCT8ms',
				roleId: role.id,
			},
		];

		for (const user of users) {
			await prisma.user.upsert({
				where: { id: user.name },
				update: {},
				create: user,
			});
		}

		console.log('✓ Seeded users');
	}
}
