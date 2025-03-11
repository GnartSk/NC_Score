import { Injectable } from '@nestjs/common';
import { CreatePdfReaderDto } from './dto/create-pdf_reader.dto';
import { UpdatePdfReaderDto } from './dto/update-pdf_reader.dto';

@Injectable()
export class PdfReaderService {
  create(createPdfReaderDto: CreatePdfReaderDto) {
    return 'This action adds a new pdfReader';
  }

  findAll() {
    return `This action returns all pdfReader`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pdfReader`;
  }

  update(id: number, updatePdfReaderDto: UpdatePdfReaderDto) {
    return `This action updates a #${id} pdfReader`;
  }

  remove(id: number) {
    return `This action removes a #${id} pdfReader`;
  }
}
