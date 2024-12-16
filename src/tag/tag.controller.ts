import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTagDto } from './dto/create-tag.dto';

@ApiTags('tags')
@Controller('tag')
export class TagController {
	@Post()
	@ApiOperation({ summary: 'Create a new tag' })
	@ApiResponse({ status: 201, description: 'Tag successfully created.' })
	@ApiResponse({ status: 400, description: 'Bad Request.' })
	create(@Body() createTagDto: CreateTagDto) {
		return 'This action adds a new tag';
	}

	@Get()
	@ApiOperation({ summary: 'Get all tags' })
	@ApiResponse({ status: 200, description: 'Return all tags.' })
	findAll() {
		return 'This action returns all tags';
	}
}
