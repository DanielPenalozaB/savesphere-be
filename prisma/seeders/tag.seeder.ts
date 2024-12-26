import { PrismaClient } from '@prisma/client';
import { Seeder } from './types';

export class TagSeeder implements Seeder {
	async run(prisma: PrismaClient): Promise<void> {
		const existingTags = await prisma.tag.count();

		if (existingTags > 0) {
			console.log('⚡ Tags already seeded, skipping...');
			return;
		}

		const tags = [
			{ name: 'Important' },
			{ name: 'Personal' },
			{ name: 'Business' },
			{ name: 'Family' },
			{ name: 'Vacation' },
		];

		for (const tag of tags) {
			await prisma.tag.upsert({
				where: { name: tag.name },
				update: {},
				create: tag,
			});
		}

		console.log('✓ Seeded tags');
	}
}
