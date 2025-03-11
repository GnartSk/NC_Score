import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import pdfParse from 'pdf-parse';

@Controller('pdf-reader')
export class PdfReaderController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPdf(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    // Đọc nội dung PDF
    const pdfData = await pdfParse(file.buffer);
    return {
      text: pdfData.text, // Nội dung văn bản trong PDF
      info: pdfData.info, // Metadata của PDF
    };
  }
}
