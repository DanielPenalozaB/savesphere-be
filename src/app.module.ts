import { Module } from '@nestjs/common';

import { AccountController } from './account/account.controller';
import { AccountModule } from './account/account.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CategoryController } from './category/category.controller';
import { CategoryModule } from './category/category.module';
import { CreditController } from './credit/credit.controller';
import { CreditModule } from './credit/credit.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { ProductController } from './product/product.controller';
import { ProductModule } from './product/product.module';
import { SubtransactionController } from './subtransaction/subtransaction.controller';
import { SubtransactionModule } from './subtransaction/subtransaction.module';
import { TagController } from './tag/tag.controller';
import { TagModule } from './tag/tag.module';
import { TransactionController } from './transaction/transaction.controller';
import { TransactionModule } from './transaction/transaction.module';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,
    AccountModule,
    TransactionModule,
    SubtransactionModule,
    CategoryModule,
    TagModule,
    CreditModule,
    ProductModule,
    AuthModule,
    PrismaModule,
  ],
  controllers: [
    AppController,
    UserController,
    AccountController,
    TransactionController,
    SubtransactionController,
    CategoryController,
    TagController,
    CreditController,
    ProductController,
  ],
  providers: [AppService, PrismaService],
})
export class AppModule {}
