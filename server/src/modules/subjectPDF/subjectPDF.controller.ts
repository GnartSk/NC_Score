import { Controller, Get, Query } from '@nestjs/common';
import { SubjectsPDFService } from './subjectPDF.service';

@Controller('subjectsPDF')
export class SubjectsPDFController {
  constructor(private readonly subjectsPDFService: SubjectsPDFService) {}

  @Get()
  getSubjects(@Query('category') category: string) {
    return this.subjectsPDFService.findByCategory(category);
  }
}