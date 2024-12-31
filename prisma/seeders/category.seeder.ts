import { PrismaClient, TransactionType } from '@prisma/client';
import { Seeder } from './types';

export class CategorySeeder implements Seeder {
  async run(prisma: PrismaClient): Promise<void> {
    const categories = [
      { name: 'Salary', slug: 'salary', type: TransactionType.INCOME },
      { name: 'Investments', slug: 'investments', type: TransactionType.INCOME },
      { name: 'Food', slug: 'food', type: TransactionType.EXPENSE },
      { name: 'Transportation', slug: 'transportation', type: TransactionType.EXPENSE },
      { name: 'Entertainment', slug: 'entertainment', type: TransactionType.EXPENSE },
      { name: 'Bills', slug: 'bills', type: TransactionType.EXPENSE },
      { name: 'Transfer', slug: 'transfer', type: TransactionType.TRANSFER },
    ];

    let createdCount = 0;

    await prisma.$transaction(async (tx) => {
      for (const category of categories) {
        const existingCategory = await tx.category.findUnique({
          where: { slug: category.slug }
        });

        if (!existingCategory) {
          await tx.category.create({
            data: category
          });
          createdCount++;
        }
      }
    });

    if (createdCount > 0) {
      console.log(`✓ Created ${createdCount} new category(ies)`);
    } else {
      console.log('⚡ No new categories needed to be created');
    }
  }
}