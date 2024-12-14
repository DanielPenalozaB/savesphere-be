import { Test, TestingModule } from '@nestjs/testing';
import { SubtransactionService } from './subtransaction.service';

describe('SubtransactionService', () => {
  let service: SubtransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubtransactionService],
    }).compile();

    service = module.get<SubtransactionService>(SubtransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
