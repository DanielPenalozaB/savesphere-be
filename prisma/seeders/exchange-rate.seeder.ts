import { PrismaClient } from '@prisma/client';
import { Seeder } from './types';

export class ExchangeRateSeeder implements Seeder {
	async run(prisma: PrismaClient): Promise<void> {
		const existingRates = await prisma.exchangeRate.count();

		if (existingRates > 0) {
			console.log('⚡ Exchange rates already seeded, skipping...');
			return;
		}

		// Get USD currency
		const usdCurrency = await prisma.currency.findUnique({
			where: { code: 'USD' },
		});

		if (!usdCurrency) {
			console.log(
				'⚠️ USD currency not found. Please run CurrencySeeder first.',
			);
			return;
		}

		const rates = [
			{ targetCurrency: 'EUR', rate: 0.85 },
			{ targetCurrency: 'GBP', rate: 0.73 },
			{ targetCurrency: 'JPY', rate: 110.0 },
			{ targetCurrency: 'COP', rate: 3800.0 },
		];

		const today = new Date();

		await prisma.$transaction(async (tx) => {
			for (const rate of rates) {
				await tx.exchangeRate.create({
					data: {
						baseCurrencyId: usdCurrency.id,
						targetCurrency: rate.targetCurrency,
						rate: rate.rate,
						date: today,
					},
				});
			}
		});

		console.log('✓ Seeded exchange rates');
	}
}
