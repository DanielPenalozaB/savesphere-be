import { Module } from '@nestjs/common';

import { TwoFactorAuthService } from './2fa.service';

@Module({
  providers: [TwoFactorAuthService],
  exports: [TwoFactorAuthService],
})
export class TwoFactorAuthModule {}
