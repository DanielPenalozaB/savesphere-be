import { Module } from '@nestjs/common';
import { SubtransactionService } from './subtransaction.service';

@Module({
  providers: [SubtransactionService]
})
export class SubtransactionModule {}
