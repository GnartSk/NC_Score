import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PersonalScheduleService } from './personal_schedule.service';
import { CreatePersonalScheduleDto } from './dto/create-personal_schedule.dto';
import { UpdatePersonalScheduleDto } from './dto/update-personal_schedule.dto';

@Controller('personal-schedule')
export class PersonalScheduleController {
	constructor(private readonly personalScheduleService: PersonalScheduleService) {}

	@Post()
	create(@Body() createPersonalScheduleDto: CreatePersonalScheduleDto) {
		return this.personalScheduleService.create(createPersonalScheduleDto);
	}

	@Get()
	findAll() {
		return this.personalScheduleService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.personalScheduleService.findOne(+id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updatePersonalScheduleDto: UpdatePersonalScheduleDto) {
		return this.personalScheduleService.update(+id, updatePersonalScheduleDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.personalScheduleService.remove(+id);
	}
}
