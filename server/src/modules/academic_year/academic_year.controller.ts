import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AcademicYearService } from './academic_year.service';
import { CreateAcademicYearDto } from './dto/create-academic_year.dto';
import { UpdateAcademicYearDto } from './dto/update-academic_year.dto';

@Controller('academic-year')
export class AcademicYearController {
  constructor(private readonly academicYearService: AcademicYearService) {}

  @Post()
  create(@Body() createAcademicYearDto: CreateAcademicYearDto) {
    return this.academicYearService.create(createAcademicYearDto);
  }

  @Get()
  findAll() {
    return this.academicYearService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.academicYearService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAcademicYearDto: UpdateAcademicYearDto) {
    return this.academicYearService.update(+id, updateAcademicYearDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.academicYearService.remove(+id);
  }
}
