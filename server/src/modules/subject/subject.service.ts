import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/schemas/user.schema';
import { Model } from 'mongoose';
import { Subject } from './schemas/subject.schema';

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

    if (user.role != 'admin') throw new UnauthorizedException('Only admin can perform this action');

    const { subjectCode, subjectName, credit, blockOfKnowledge, specialized } = createSubjectDto;

    const isExit = await this.isSubjectCodeExits(subjectCode);
    if (isExit) throw new BadRequestException('subjectCode has been used.');

    const subject = await this.subjectModel.create({
      subjectCode,
      subjectName,
      credit,
      blockOfKnowledge,
      specialized,
    });

    return subject;
  }

  findAll() {
    return `This action returns all subject`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subject`;
  }

  update(id: number, updateSubjectDto: UpdateSubjectDto) {
    return `This action updates a #${id} subject`;
  }

  remove(id: number) {
    return `This action removes a #${id} subject`;
  }
}
