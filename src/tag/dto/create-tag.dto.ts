import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateTagDto {
	@IsString()
	@IsNotEmpty()
	@IsUUID()
	id: string;

	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	description: string;
}
