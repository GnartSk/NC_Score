import { Module } from '@nestjs/common';
import { AcademicYearService } from './academic_year.service';
import { AcademicYearController } from './academic_year.controller';

@Module({
  controllers: [AcademicYearController],
  providers: [AcademicYearService],
})
export class AcademicYearModule {}
