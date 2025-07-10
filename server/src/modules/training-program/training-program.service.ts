import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TrainingProgram, Subject } from './schemas/training-program.schema';
import { UploadTrainingProgramDto } from './dto/upload-training-program.dto';
import * as XLSX from 'xlsx';
@Injectable()
export class TrainingProgramService {
  constructor(
    @InjectModel(TrainingProgram.name)
    private trainingProgramModel: Model<TrainingProgram>,
  ) {}

  // Thêm các hàm xử lý ở đây

  async uploadTrainingProgram(file: Express.Multer.File, body: UploadTrainingProgramDto) {
    // Đọc buffer file Excel
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });

    // Parse dữ liệu: lấy group, code, name
    let currentGroup = '';
    const subjects: Subject[] = [];
    for (const row of rows) {
      const groupCell = row[0]?.toString().trim();
      const codeCell = row[1]?.toString().trim();
      const nameCell = row[2]?.toString().trim();
      if (groupCell) {
        currentGroup = groupCell;
      }
      if (codeCell && nameCell) {
        subjects.push({ group: currentGroup, subjectCode: codeCell, subjectName: nameCell });
      }
    }

    // Tạo document mới
    const doc = new this.trainingProgramModel({
      major: body.major,
      majorCode: body.majorCode,
      course: body.course,
      subjects,
    });
    await doc.save();
    return { message: 'Upload thành công', inserted: subjects.length };
  }

  async getAllTrainingPrograms() {
    return this.trainingProgramModel.find().lean();
  }

  async getTrainingProgramByMajorAndCourse(major: string, course: string) {
    return this.trainingProgramModel.findOne({ major, course }).lean();
  }

  async updateTrainingProgram(id: string, body: any) {
    return this.trainingProgramModel.findByIdAndUpdate(id, body, { new: true }).lean();
  }

  async deleteTrainingProgram(id: string) {
    return this.trainingProgramModel.findByIdAndDelete(id).lean();
  }
} 