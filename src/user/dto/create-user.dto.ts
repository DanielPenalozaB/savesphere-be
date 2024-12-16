import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
	@ApiPropertyOptional({ example: 'John Doe' })
	@IsString()
	@IsOptional()
	name: string;

	@ApiProperty({ example: 'john@example.com' })
	@IsEmail()
	email: string;

	@ApiProperty({ example: 'password123', minLength: 8 })
	@IsString()
	@MinLength(8)
	password: string;
}
