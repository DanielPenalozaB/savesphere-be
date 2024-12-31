import { PrismaClient } from '@prisma/client';
import {
	RoleSeeder,
	UserSeeder,
	CategorySeeder,
	TagSeeder,
	CurrencySeeder,
	ExchangeRateSeeder,
} from './seeders';

const prisma = new PrismaClient();

async function main() {
	console.log('Starting seed...');

	await new RoleSeeder().run(prisma);
	await new UserSeeder().run(prisma);
	await new CategorySeeder().run(prisma);
	await new TagSeeder().run(prisma);
	await new CurrencySeeder().run(prisma);
	await new ExchangeRateSeeder().run(prisma);

	console.log('Seed completed successfully!');
}

main()
	.catch((e) => {
		console.error('Error while seeding:', e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
