import { PrismaClient } from '@prisma/client';
import { Seeder } from './types';

export class RoleSeeder implements Seeder {
	async run(prisma: PrismaClient): Promise<void> {
		const existingRoles = await prisma.role.count();

		if (existingRoles > 0) {
			console.log('⚡ Roles already seeded, skipping...');
			return;
		}

		const roles = [{ name: 'ADMIN' }, { name: 'USER' }, { name: 'MANAGER' }];

		await prisma.$transaction(async (tx) => {
      for (const role of roles) {
        await tx.role.create({
          data: role,
        });
      }
    });

		console.log('✓ Seeded roles');
	}
}
