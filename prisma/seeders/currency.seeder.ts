import { PrismaClient } from '@prisma/client';
import { Seeder } from './types';

export class CurrencySeeder implements Seeder {
	async run(prisma: PrismaClient): Promise<void> {
		const currencies = [
			{ code: 'USD', name: 'US Dollar', symbol: '$' },
			{ code: 'EUR', name: 'Euro', symbol: '€' },
			{ code: 'GBP', name: 'British Pound', symbol: '£' },
			{ code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
			{ code: 'COP', name: 'Colombian Peso', symbol: '$' },
		];

		let createdCount = 0;

		await prisma.$transaction(async (tx) => {
			for (const currency of currencies) {
				const existingCurrency = await tx.currency.findUnique({
					where: { code: currency.code },
				});

				if (!existingCurrency) {
					await tx.currency.create({
						data: currency,
					});
					createdCount++;
				}
			}
		});

		if (createdCount > 0) {
			console.log(`✓ Created ${createdCount} new currency(ies)`);
		} else {
			console.log('⚡ No new currencies needed to be created');
		}
	}
}
