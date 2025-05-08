import { ReaderService } from './reader.service';
import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('reader')
export class ReaderController {
  constructor(private readonly readerService: ReaderService) {}

  @Post('html')
  @UseInterceptors(FileInterceptor('file'))
  async uploadHtml(@UploadedFile() file: Express.Multer.File): Promise<Record<string, any>> {
    if (!file) return { error: 'No file uploaded' };

    return this.readerService.uploadHtml(file);
  }

  @Post('pdf')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPdf(@UploadedFile() file: Express.Multer.File): Promise<Record<string, any>> {
    if (!file) return { error: 'No file uploaded' };

    return await this.readerService.uploadPdf(file);
  }

  @Post('getSubject')
  @UseInterceptors(FileInterceptor('file'))
  async getSubject(@UploadedFile() file: Express.Multer.File): Promise<Record<string, any>> {
    if (!file) return { error: 'No file uploaded' };

    return this.readerService.getSubject(file);
  }
}
