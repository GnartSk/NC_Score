import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RelateService } from './relate.service';
import { CreateRelateDto } from './dto/create-relate.dto';
import { UpdateRelateDto } from './dto/update-relate.dto';

@Controller('relate')
export class RelateController {
	constructor(private readonly relateService: RelateService) {}

	@Post()
	create(@Body() createRelateDto: CreateRelateDto) {
		return this.relateService.create(createRelateDto);
	}

	@Get()
	findAll() {
		return this.relateService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.relateService.findOne(+id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateRelateDto: UpdateRelateDto) {
		return this.relateService.update(+id, updateRelateDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.relateService.remove(+id);
	}
}
