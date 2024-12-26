import { IsString, IsUUID, IsDate } from 'class-validator';

export class RefreshToken {
	@IsUUID()
	id: string;

	@IsString()
	token: string;

	@IsUUID()
	userId: string;

	@IsDate()
	expiresAt: Date;
}
