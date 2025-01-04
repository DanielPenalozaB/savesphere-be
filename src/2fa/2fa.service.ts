import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import * as qrcode from 'qrcode';

@Injectable()
export class TwoFactorAuthService {
  generateSecret() {
    const secret = authenticator.generateSecret();
    return secret;
  }

  generateQRCode(secret: string, email: string) {
    const otpauth = authenticator.keyuri(email, 'Shipglide', secret);
    return qrcode.toDataURL(otpauth);
  }

  verifyToken(token: string, secret: string) {
    return authenticator.verify({ token, secret });
  }
}
