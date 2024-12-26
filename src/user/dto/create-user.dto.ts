import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
	IsEmail,
	IsString,
	IsOptional,
	MinLength,
	IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
	@ApiPropertyOptional({ example: 'John Doe' })
	@IsString()
	@IsOptional()
	name: string;

	@ApiProperty({ example: 'john@example.com' })
	@IsEmail()
	email: string;

	@ApiProperty({
		example: 'StrongP@ss123',
		description:
			'Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters (!@#$%^&*(),.?":{}[]|<>)',
	})
	@IsString()
	@IsStrongPassword()
	password: string;
}
