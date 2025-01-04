import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ClientSecretAuthGuard extends AuthGuard('client-secret') {}
