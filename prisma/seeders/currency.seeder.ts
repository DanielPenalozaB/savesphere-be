import { PrismaClient } from '@prisma/client';
import { Seeder } from './types';

export class CurrencySeeder implements Seeder {
	async run(prisma: PrismaClient): Promise<void> {
		const existingCurrencies = await prisma.currency.count();

		if (existingCurrencies > 0) {
			console.log('⚡ Currencies already seeded, skipping...');
			return;
		}

		const currencies = [
			{ code: 'USD', name: 'US Dollar', symbol: '$' },
			{ code: 'EUR', name: 'Euro', symbol: '€' },
			{ code: 'GBP', name: 'British Pound', symbol: '£' },
			{ code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
			{ code: 'COP', name: 'Colombian Peso', symbol: '$' },
		];

		for (const currency of currencies) {
			await prisma.currency.upsert({
				where: { code: currency.code },
				update: {},
				create: currency,
			});
		}

		console.log('✓ Seeded currencies');
	}
}
