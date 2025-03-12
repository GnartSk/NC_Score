import { ReaderService } from './reader.service';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
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
}
