import { PrismaClient } from '@prisma/client';
import { Seeder } from './types';
import * as bcrypt from 'bcrypt';

export class UserSeeder implements Seeder {
	async run(prisma: PrismaClient): Promise<void> {
		let createdCount = 0;

		await prisma.$transaction(async (tx) => {
			let role = await tx.role.findFirst({ where: { name: 'ADMIN' } });

			if (!role) {
				role = await tx.role.create({
					data: {
						name: 'ADMIN',
					},
				});
				console.log('✓ Created missing ADMIN role');
			}

			const users = [
				{
					name: 'SaveSphere',
					email: 'savesphere@app.com',
					password: '8XAY=PQCT8ms',
					roleId: role.id,
				},
			];

			for (const user of users) {
				const existingUser = await tx.user.findUnique({
					where: { email: user.email },
				});

				if (!existingUser) {
					const hashedPassword = await bcrypt.hash(user.password, 10);
					await tx.user.create({
						data: {
							...user,
							password: hashedPassword,
						},
					});
					createdCount++;
				}
			}
		});

		if (createdCount > 0) {
			console.log(`✓ Created ${createdCount} new user(s)`);
		} else {
			console.log('⚡ No new users needed to be created');
		}
	}
}
