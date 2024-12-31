import { PrismaClient } from '@prisma/client';
import { Seeder } from './types';

export class RoleSeeder implements Seeder {
	async run(prisma: PrismaClient): Promise<void> {
		const roles = [{ name: 'ADMIN' }, { name: 'USER' }, { name: 'MANAGER' }];

		let createdCount = 0;

		await prisma.$transaction(async (tx) => {
			for (const role of roles) {
				const existingRole = await tx.role.findUnique({
					where: {
						id: role.name,
						OR: [{ name: role.name }],
					},
				});

				if (!existingRole) {
					await tx.role.create({
						data: role,
					});
					createdCount++;
				}
			}
		});

		if (createdCount > 0) {
			console.log(`✓ Created ${createdCount} new role(s)`);
		} else {
			console.log('⚡ No new roles needed to be created');
		}
	}
}
