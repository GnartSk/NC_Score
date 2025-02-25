import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExpectedSubjectService } from './expected_subject.service';
import { CreateExpectedSubjectDto } from './dto/create-expected_subject.dto';
import { UpdateExpectedSubjectDto } from './dto/update-expected_subject.dto';

@Controller('expected-subject')
export class ExpectedSubjectController {
	constructor(private readonly expectedSubjectService: ExpectedSubjectService) {}

	@Post()
	create(@Body() createExpectedSubjectDto: CreateExpectedSubjectDto) {
		return this.expectedSubjectService.create(createExpectedSubjectDto);
	}

	@Get()
	findAll() {
		return this.expectedSubjectService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.expectedSubjectService.findOne(+id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateExpectedSubjectDto: UpdateExpectedSubjectDto) {
		return this.expectedSubjectService.update(+id, updateExpectedSubjectDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.expectedSubjectService.remove(+id);
	}
}
