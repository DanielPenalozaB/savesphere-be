import { PrismaClient } from '@prisma/client';
import { Seeder } from './types';

export class ExchangeRateSeeder implements Seeder {
	async run(prisma: PrismaClient): Promise<void> {
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
		let createdCount = 0;

		await prisma.$transaction(async (tx) => {
			for (const rate of rates) {
				const existingRate = await tx.exchangeRate.findFirst({
					where: {
						baseCurrencyId: usdCurrency.id,
						targetCurrency: rate.targetCurrency,
						date: today,
					},
				});

				if (!existingRate) {
					await tx.exchangeRate.create({
						data: {
							baseCurrencyId: usdCurrency.id,
							targetCurrency: rate.targetCurrency,
							rate: rate.rate,
							date: today,
						},
					});
					createdCount++;
				}
			}
		});

		if (createdCount > 0) {
			console.log(`✓ Created ${createdCount} new exchange rate(s)`);
		} else {
			console.log('⚡ No new exchange rates needed to be created');
		}
	}
}
