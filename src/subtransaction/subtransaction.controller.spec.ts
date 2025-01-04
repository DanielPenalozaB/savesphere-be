import { Test, TestingModule } from '@nestjs/testing';

import { SubtransactionController } from './subtransaction.controller';

describe('SubtransactionController', () => {
  let controller: SubtransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubtransactionController],
    }).compile();

    controller = module.get<SubtransactionController>(SubtransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
