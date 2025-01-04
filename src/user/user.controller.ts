import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { PageDto } from 'src/common/dto/page.dto';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard)
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

	@Post()
	@ApiOperation({ summary: 'Create new user' })
	@ApiResponse({ status: 201, description: 'User created successfully' })
	@ApiResponse({ status: 409, description: 'Email already registered' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

	@Get()
	@ApiOperation({ summary: 'Get all users with pagination' })
	@ApiResponse({
	  status: 200,
	  description: 'List of users retrieved successfully',
	  type: () => PageDto<UserResponseDto>,
	})
	findAll(
		@Query() pageOptions: PageOptionsDto,
	): Promise<PageDto<UserResponseDto>> {
	  return this.userService.findAll(pageOptions);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get user by id' })
	@ApiResponse({ status: 200, description: 'User retrieved successfully' })
	@ApiResponse({ status: 404, description: 'User not found' })
	findOne(@Param('id') id: string) {
	  return this.userService.findOne(id);
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Update user' })
	@ApiResponse({ status: 200, description: 'User updated successfully' })
	@ApiResponse({ status: 404, description: 'User not found' })
	@ApiResponse({ status: 409, description: 'Email already registered' })
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
	  return this.userService.update(id, updateUserDto);
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: 'Delete user' })
	@ApiResponse({ status: 204, description: 'User deleted successfully' })
	@ApiResponse({ status: 404, description: 'User not found' })
	remove(@Param('id') id: string) {
	  return this.userService.remove(id);
	}
}
