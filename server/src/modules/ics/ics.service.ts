import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IcsEvent } from './schemas/ics.schema';
import { IcsEventDto } from './dto/ics-event.dto';
import * as path from 'path';
import * as fs from 'fs';
import { parseIcsBuffer, parseIcsFile, saveEventsToIcs, extractClassCodesFromBuffer, extractClassCodeAndRoom, extractClassCodesAndNamesFromBuffer } from '@/utils/ics-helper';
import { promisify } from 'util';

const mkdirAsync = promisify(fs.mkdir);

@Injectable()
export class IcsService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads', 'ics');

  constructor(
    @InjectModel(IcsEvent.name) private icsEventModel: Model<IcsEvent>,
  ) {
    // Đảm bảo thư mục tồn tại
    this.ensureUploadDirExists();
  }

  private async ensureUploadDirExists() {
    try {
      await mkdirAsync(this.uploadDir, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') {
        console.error('Error creating upload directory:', error);
      }
    }
  }

  async importIcsFile(file: Express.Multer.File): Promise<IcsEvent[]> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      // Lưu file
      const filename = `${Date.now()}-${file.originalname}`;
      const filePath = path.join(this.uploadDir, filename);
      
      // Đảm bảo thư mục tồn tại
      await this.ensureUploadDirExists();
      
      // Ghi file
      fs.writeFileSync(filePath, file.buffer);
      
      // Phân tích file
      const events = parseIcsBuffer(file.buffer);
      
      // Lưu events vào database
      const savedEvents: IcsEvent[] = [];
      
      for (const event of events) {
        // Đảm bảo subjectName luôn có giá trị
        if (!event.subjectName) {
          event.subjectName = event.classCode || event.title || 'Unknown Subject';
        }
        
        // Kiểm tra xem event đã tồn tại chưa (dựa vào UID)
        if (event.uid) {
          const existingEvent = await this.icsEventModel.findOne({ uid: event.uid }).exec();
          
          if (existingEvent) {
            // Cập nhật event nếu đã tồn tại
            Object.assign(existingEvent, event);
            const updatedEvent = await existingEvent.save();
            savedEvents.push(updatedEvent);
            continue;
          }
        }
        
        // Tạo mới nếu chưa tồn tại
        const newEvent = new this.icsEventModel(event);
        await newEvent.save();
        savedEvents.push(newEvent);
      }
      
      return savedEvents;
    } catch (error) {
      throw new BadRequestException(`Error importing ICS file: ${error.message}`);
    }
  }

  /**
   * Trích xuất mã lớp học từ file ICS
   * @param file File ICS được upload
   * @returns Danh sách mã lớp học và tên môn học
   */
  async extractClassCodes(file: Express.Multer.File): Promise<Array<{ code: string, name: string }>> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      if (!file.buffer) {
        throw new BadRequestException('File buffer is empty or not available');
      }
      const classCodesAndNames = extractClassCodesAndNamesFromBuffer(file.buffer);
      // Lọc trùng theo code
      const unique = Array.from(new Map(classCodesAndNames.map(item => [item.code, item])).values());
      return unique;
    } catch (error) {
      throw new BadRequestException(`Error extracting class codes: ${error.message}`);
    }
  }

  /**
   * Tìm các mã lớp học bị trùng lặp
   * @param classCodes Danh sách mã lớp học
   * @returns Object chứa mã lớp học và số lần xuất hiện
   */
  findDuplicateClassCodes(classCodes: string[]): Record<string, number> {
    const occurrences: Record<string, number> = {};
    const duplicates: Record<string, number> = {};
    
    // Đếm số lần xuất hiện của mỗi mã lớp
    classCodes.forEach(code => {
      occurrences[code] = (occurrences[code] || 0) + 1;
    });
    
    // Lọc ra những mã lớp xuất hiện nhiều hơn 1 lần
    Object.keys(occurrences).forEach(code => {
      if (occurrences[code] > 1) {
        duplicates[code] = occurrences[code];
      }
    });
    
    return duplicates;
  }

  /**
   * Trích xuất thông tin lớp học (mã lớp và phòng học) từ file ICS
   * @param file File ICS được upload
   * @returns Danh sách thông tin lớp học
   */
  async extractClassInfo(file: Express.Multer.File): Promise<Array<{code: string, room: string, isDuplicate?: boolean}>> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      console.log('File info:', {
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        hasBuffer: !!file.buffer,
      });

      // Kiểm tra buffer trước khi xử lý
      if (!file.buffer) {
        throw new BadRequestException('File buffer is empty or not available');
      }
      
      // Đọc nội dung file ICS
      const content = file.buffer.toString('utf8');
      
      // Tìm tất cả các dòng SUMMARY
      const summaryRegex = /SUMMARY:(.*?)(?:\r?\n|\r|$)/g;
      const matches = [...content.matchAll(summaryRegex)];
      
      // Trích xuất mã lớp học và phòng học
      const classInfo = matches.map(match => {
        const summary = match[1];
        const { classCode: code, room } = extractClassCodeAndRoom(summary);
        return { code, room };
      });
      
      // Kiểm tra mã lớp trùng lặp
      const classCodes = classInfo.map(info => info.code);
      const codeOccurrences: Record<string, number> = {};
      
      // Đếm số lần xuất hiện của mỗi mã lớp
      classCodes.forEach(code => {
        codeOccurrences[code] = (codeOccurrences[code] || 0) + 1;
      });
      
      // Đánh dấu những mã lớp trùng lặp
      const classInfoWithDuplicateFlag = classInfo.map(info => {
        const isDuplicate = codeOccurrences[info.code] > 1;
        return { ...info, isDuplicate };
      });
      
      return classInfoWithDuplicateFlag;
    } catch (error) {
      console.error('Extract class info error:', error);
      throw new BadRequestException(`Error extracting class info: ${error.message}`);
    }
  }

  async getAllEvents(): Promise<IcsEvent[]> {
    return this.icsEventModel.find().exec();
  }

  async exportIcsFile(): Promise<string> {
    try {
      const events = await this.getAllEvents();
      
      if (events.length === 0) {
        throw new BadRequestException('No events to export');
      }
      
      // Convert MongoDB documents to IcsEvent objects
      const icsEvents = events.map(event => ({
        title: event.title,
        description: event.description,
        start: new Date(event.start),
        end: new Date(event.end),
        idStudent: event.idStudent,
        location: event.location,
        uid: event.uid,
        subjectName: event.subjectName
      }));
      
      // Ensure upload directory exists
      await this.ensureUploadDirExists();
      
      // Generate filename
      const filename = `export-${Date.now()}.ics`;
      const filePath = path.join(this.uploadDir, filename);
      
      // Save events to ICS file
      await saveEventsToIcs(icsEvents, filePath);
      
      return filePath;
    } catch (error) {
      throw new BadRequestException(`Error exporting ICS file: ${error.message}`);
    }
  }

  async createEvent(eventDto: IcsEventDto): Promise<IcsEvent> {
    const event = new this.icsEventModel({
      ...eventDto,
      start: new Date(eventDto.start),
      end: new Date(eventDto.end),
      uid: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}@ncscore.com`,
      subjectName: eventDto.subjectName
    });
    
    return event.save();
  }
}
