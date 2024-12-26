import { ApiProperty } from '@nestjs/swagger';

interface Role {
	id: string;
	name: string;
}

export class UserResponseDto {
	@ApiProperty()
	id: string;

	@ApiProperty()
	email: string;

	@ApiProperty()
	name: string;

	@ApiProperty()
	role: Role;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	updatedAt: Date;
}
