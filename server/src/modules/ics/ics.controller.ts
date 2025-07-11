import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  UseInterceptors, 
  UploadedFile, 
  Res, 
  BadRequestException,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { IcsService } from './ics.service';
import { IcsEventDto } from './dto/ics-event.dto';
import { Public } from '@/decorator/customize';
import { existsSync } from 'fs';
import { memoryStorage } from 'multer';

@Controller('ics')
export class IcsController {
  constructor(private readonly icsService: IcsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadIcsFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    
    // Kiểm tra phần mở rộng của file
    if (!file.originalname.toLowerCase().endsWith('.ics')) {
      throw new BadRequestException('Only .ics files are allowed');
    }
    
    return this.icsService.importIcsFile(file);
  }

  @Post('extract-class-codes')
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(), // Sử dụng memory storage để lưu buffer trong bộ nhớ
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
  }))
  async extractClassCodes(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }

      console.log('File received:', {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        buffer: file.buffer ? `${file.buffer.length} bytes` : 'no buffer',
      });
      
      // Kiểm tra phần mở rộng của file
      if (!file.originalname.toLowerCase().endsWith('.ics')) {
        throw new BadRequestException('Only .ics files are allowed');
      }

      // Kiểm tra buffer
      if (!file.buffer || file.buffer.length === 0) {
        throw new BadRequestException('Empty file buffer');
      }
      
      return this.icsService.extractClassCodes(file);
    } catch (error) {
      console.error('Error in extractClassCodes controller:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Error processing file: ${error.message}`);
    }
  }

  @Post('extract-class-info')
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(), // Sử dụng memory storage để lưu buffer trong bộ nhớ
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
  }))
  async extractClassInfo(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }
    
      console.log('File received:', {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        buffer: file.buffer ? `${file.buffer.length} bytes` : 'no buffer',
      });
      
      // Kiểm tra phần mở rộng của file
      if (!file.originalname.toLowerCase().endsWith('.ics')) {
        throw new BadRequestException('Only .ics files are allowed');
      }

      // Kiểm tra buffer
      if (!file.buffer || file.buffer.length === 0) {
        throw new BadRequestException('Empty file buffer');
      }
      
      return this.icsService.extractClassInfo(file);
    } catch (error) {
      console.error('Error in extractClassInfo controller:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Error processing file: ${error.message}`);
    }
  }

  @Get('events')
  async getAllEvents() {
    return this.icsService.getAllEvents();
  }

  @Post('events')
  async createEvent(@Body() eventDto: IcsEventDto) {
    return this.icsService.createEvent(eventDto);
  }

  @Get('export')
  async exportIcsFile(@Res() res: Response) {
    try {
      const filePath = await this.icsService.exportIcsFile();
      
      if (!existsSync(filePath)) {
        throw new BadRequestException('File not found');
      }
      
      // Tên file sẽ hiển thị cho người dùng khi tải xuống
      const fileName = 'calendar.ics';
      
      // Thiết lập header để hướng dẫn tải file thay vì hiển thị nó
      res.set({
        'Content-Type': 'text/calendar',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      });
      
      // Stream file để gửi đến client
      const fileStream = createReadStream(filePath);
      fileStream.pipe(res);
      
    } catch (error) {
      throw new BadRequestException(`Error exporting ICS file: ${error.message}`);
    }
  }

  @Post('check-duplicate-classes')
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(), // Sử dụng memory storage để lưu buffer trong bộ nhớ
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
  }))
  async checkDuplicateClasses(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }

      console.log('File received for duplicate check:', {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        buffer: file.buffer ? `${file.buffer.length} bytes` : 'no buffer',
      });
      
      // Kiểm tra phần mở rộng của file
      if (!file.originalname.toLowerCase().endsWith('.ics')) {
        throw new BadRequestException('Only .ics files are allowed');
      }

      // Kiểm tra buffer
      if (!file.buffer || file.buffer.length === 0) {
        throw new BadRequestException('Empty file buffer');
      }
      
      // Trích xuất thông tin lớp học với cờ đánh dấu trùng lặp
      const classInfo = await this.icsService.extractClassInfo(file);
      
      // Lọc ra những mã lớp bị trùng
      const duplicates = classInfo.filter(info => info.isDuplicate);
      
      // Nhóm các lớp trùng lặp theo mã lớp
      const groupedDuplicates = {};
      duplicates.forEach(item => {
        if (!groupedDuplicates[item.code]) {
          groupedDuplicates[item.code] = [];
        }
        groupedDuplicates[item.code].push({
          code: item.code,
          room: item.room
        });
      });
      
      // Trả về kết quả
      return {
        allClasses: classInfo.map(({ code, room }) => ({ code, room })),
        hasDuplicates: duplicates.length > 0,
        duplicateClasses: Object.values(groupedDuplicates)
      };
    } catch (error) {
      console.error('Error in checkDuplicateClasses controller:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Error processing file: ${error.message}`);
    }
  }
}
