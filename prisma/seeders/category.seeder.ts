import { PrismaClient, TransactionType } from '@prisma/client';
import { Seeder } from './types';

export class CategorySeeder implements Seeder {
	async run(prisma: PrismaClient): Promise<void> {
		const existingCategories = await prisma.category.count();

		if (existingCategories > 0) {
			console.log('⚡ Categories already seeded, skipping...');
			return;
		}

		const categories = [
			{ name: 'Salary', slug: 'salary', type: TransactionType.INCOME },
			{
				name: 'Investments',
				slug: 'investments',
				type: TransactionType.INCOME,
			},
			{ name: 'Food', slug: 'food', type: TransactionType.EXPENSE },
			{
				name: 'Transportation',
				slug: 'transportation',
				type: TransactionType.EXPENSE,
			},
			{
				name: 'Entertainment',
				slug: 'entertainment',
				type: TransactionType.EXPENSE,
			},
			{ name: 'Bills', slug: 'bills', type: TransactionType.EXPENSE },
			{ name: 'Transfer', slug: 'transfer', type: TransactionType.TRANSFER },
		];

		await prisma.$transaction(async (tx) => {
      for (const category of categories) {
        await tx.category.create({
          data: category,
        });
      }
    });

		console.log('✓ Seeded categories');
	}
}
