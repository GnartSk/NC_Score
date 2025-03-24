import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { Subject } from './schemas/subject.schema';
import { PaginationDto } from '../user/dto/pagination.dto';

@Injectable()
export class SubjectService {
  constructor(
    @InjectModel(Subject.name)
    private subjectModel: Model<Subject>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  isSubjectCodeExits = async (subjectCode: string) => {
    const subject = await this.subjectModel.exists({ subjectCode });
    if (subject) return true;
    return false;
  };

  async create(createSubjectDto: CreateSubjectDto, userId: any) {
    const user = await this.userModel.findById(userId);

    if (!user) throw new NotFoundException('User not found...');

    if (user.role != 'ADMIN') throw new UnauthorizedException('Only admin can perform this action');

    const { subjectCode, subjectName, credit, blockOfKnowledge, specialized, subjectDescription, relatedToIndustry } =
      createSubjectDto;

    const isExit = await this.isSubjectCodeExits(subjectCode);
    if (isExit) throw new BadRequestException('subjectCode has been used.');

    const subject = await this.subjectModel.create({
      subjectCode,
      subjectName,
      credit,
      blockOfKnowledge,
      specialized,
      subjectDescription,
      relatedToIndustry,
    });

    return subject;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const users = await this.subjectModel.find().skip(skip).limit(limit);
    const total = await this.subjectModel.countDocuments();

    return {
      users,
      totalRecords: total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(_id: string) {
    return await this.subjectModel.findOne({ _id });
  }

  async update(_id: string, updateSubjectDto: UpdateSubjectDto) {
    if (!mongoose.isValidObjectId(_id)) throw new BadRequestException('Invalid MongoDB _id');

    const subject = await this.subjectModel.findById(_id);

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    if (updateSubjectDto.subjectCode && updateSubjectDto.subjectCode !== subject.subjectCode) {
      const isExist = await this.isSubjectCodeExits(updateSubjectDto.subjectCode);
      if (isExist) throw new BadRequestException('subjectCode has been used.');
    }

    Object.assign(subject, updateSubjectDto);

    await subject.save();
    return subject;
  }

  remove(_id: string) {
    if (mongoose.isValidObjectId(_id)) {
      return this.subjectModel.deleteOne({ _id });
    } else {
      throw new BadRequestException('Invalid MongoDB _id');
    }
  }
}
