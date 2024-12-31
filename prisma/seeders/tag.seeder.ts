import { PrismaClient } from '@prisma/client';
import { Seeder } from './types';

export class TagSeeder implements Seeder {
	async run(prisma: PrismaClient): Promise<void> {
		const tags = [
			{ name: 'Important' },
			{ name: 'Personal' },
			{ name: 'Business' },
			{ name: 'Family' },
			{ name: 'Vacation' },
		];

		let createdCount = 0;

		await prisma.$transaction(async (tx) => {
			for (const tag of tags) {
				const existingTag = await tx.tag.findUnique({
					where: { name: tag.name },
				});

				if (!existingTag) {
					await tx.tag.create({
						data: tag,
					});
					createdCount++;
				}
			}
		});

		if (createdCount > 0) {
			console.log(`✓ Created ${createdCount} new tag(s)`);
		} else {
			console.log('⚡ No new tags needed to be created');
		}
	}
}
