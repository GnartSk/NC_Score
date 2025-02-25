import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	create(@Body() createUserDto: CreateUserDto) {
		return this.userService.create(createUserDto);
	}

	@Get()
	async findAll(
		@Query() query: string,
		@Query('current') current: string,
		@Query('pageSize') pageSize: string,
	) {
		return this.userService.findAll(query, +current, +pageSize);
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.userService.findOne(+id);
	}

	@Patch()
	update(@Body() updateUserDto: UpdateUserDto) {
		return this.userService.update(updateUserDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.userService.remove(id);
	}
}
