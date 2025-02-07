import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubjectRelateService } from './subject_relate.service';
import { CreateSubjectRelateDto } from './dto/create-subject_relate.dto';
import { UpdateSubjectRelateDto } from './dto/update-subject_relate.dto';

@Controller('subject-relate')
export class SubjectRelateController {
  constructor(private readonly subjectRelateService: SubjectRelateService) {}

  @Post()
  create(@Body() createSubjectRelateDto: CreateSubjectRelateDto) {
    return this.subjectRelateService.create(createSubjectRelateDto);
  }

  @Get()
  findAll() {
    return this.subjectRelateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subjectRelateService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubjectRelateDto: UpdateSubjectRelateDto) {
    return this.subjectRelateService.update(+id, updateSubjectRelateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subjectRelateService.remove(+id);
  }
}
