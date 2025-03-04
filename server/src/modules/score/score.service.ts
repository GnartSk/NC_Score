import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateScoreDto } from './dto/create-score.dto';
import { UpdateScoreDto } from './dto/update-score.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Score } from './schemas/score.schema';
import { User } from '../user/schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { Subject } from '../subject/schemas/subject.schema';
import { PaginationDto } from '../user/dto/pagination.dto';

@Injectable()
export class ScoreService {
  constructor(
    @InjectModel(Score.name)
    private scoreModel: Model<Score>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Subject.name)
    private subjectModel: Model<Subject>,
  ) {}

  isSubjectCodeNotExits = async (subjectCode: string, subjectName: string, credit: number) => {
    const subjectExist = await this.subjectModel.exists({ subjectCode: subjectCode });
    if (subjectExist) return false;

    // Add new subject
    const score = await this.subjectModel.create({
      subjectCode,
      subjectName,
      credit,
      blockOfKnowledge: 'Tự chọn',
      specialized: 'Tự chọn',
      relatedToIndustry: [],
    });
    return score;
  };

  async create(createScoreDto: CreateScoreDto, userId: any) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found...');

    const { QT, TH, GK, CK, TK, status, subjectCode, subjectName, credit } = createScoreDto;

    const isNotExits = await this.isSubjectCodeNotExits(subjectCode, subjectName, credit);

    const updateData: any = { status };
    if (QT !== undefined) updateData.QT = QT;
    if (TH !== undefined) updateData.TH = TH;
    if (GK !== undefined) updateData.GK = GK;
    if (CK !== undefined) updateData.CK = CK;
    if (TK !== undefined) updateData.TK = TK;

    const score = await this.scoreModel.findOneAndUpdate(
      { subjectCode, idStudent: userId }, // Điều kiện tìm kiếm
      updateData, // Dữ liệu cập nhật
      { upsert: true, new: true }, // Tạo mới nếu không tồn tại, trả về dữ liệu mới sau khi cập nhật
    );

    if (isNotExits)
      return {
        message: 'New subject had been added',
        score: score,
        subject: isNotExits,
      };

    return score;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const users = await this.scoreModel.find().skip(skip).limit(limit);
    const total = await this.scoreModel.countDocuments();

    return {
      users,
      totalRecords: total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAllOfUser(_id: string) {
    const scores = await this.scoreModel.find({ idStudent: _id });
    const totalRecords = await this.scoreModel.countDocuments({ idStudent: _id });

    return {
      scores,
      totalRecords,
    };
  }

  async findOne(_id: string) {
    return await this.scoreModel.findOne({ _id });
  }

  async update(_id: string, updateScoreDto: UpdateScoreDto) {
    if (!mongoose.isValidObjectId(_id)) throw new BadRequestException('Invalid MongoDB _id');

    const score = await this.scoreModel.findById(_id);

    if (!score) {
      throw new NotFoundException('Score not found');
    }

    Object.assign(score, updateScoreDto);

    await score.save();
    return score;
  }

  remove(_id: string) {
    if (mongoose.isValidObjectId(_id)) {
      return this.scoreModel.deleteOne({ _id });
    } else {
      throw new BadRequestException('Invalid MongoDB _id');
    }
  }
}
