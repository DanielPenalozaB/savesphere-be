import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as passport from 'passport';

@Injectable()
export class JwtOrClientSecretGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const jwtAuthResult = await new Promise<boolean>((resolve) => {
      passport.authenticate(
        'jwt',
        { session: false },
        (err: unknown, user: { authType: string }) => {
          if (err || !user) {
            resolve(false);
          } else {
            user.authType = 'jwt';
            request.user = user;
            resolve(true);
          }
        })(request, context.switchToHttp().getResponse(), context.switchToHttp().getNext());
    });

    if (jwtAuthResult) {
      return true;
    }

    const clientSecretAuthResult = await new Promise<boolean>((resolve) => {
      passport.authenticate(
        'client-secret',
        { session: false },
        (err: unknown, client: { authType: string }) => {
          if (err || !client) {
            resolve(false);
          } else {
            client.authType = 'client-secret';
            request.user = client;
            resolve(true);
          }
        })(request, context.switchToHttp().getResponse(), context.switchToHttp().getNext());
    });

    if (clientSecretAuthResult) {
      return true;
    }

    throw new UnauthorizedException('Unauthorized');
  }
}
