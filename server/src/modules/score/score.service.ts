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

  isSubjectCodeNotExits = async (subjectCode: string, subjectName: string, credit: number, semester: string) => {
    const subjectExist = await this.subjectModel.exists({ subjectCode: subjectCode, semester });
    if (subjectExist) return false;

    // Add new subject
    const score = await this.subjectModel.create({
      subjectCode,
      subjectName,
      credit,
      semester,
      blockOfKnowledge: 'Tự chọn',
      specialized: 'Tự chọn',
      relatedToIndustry: [],
    });
    return score;
  };

  async create(createScoreDto: CreateScoreDto, userId: any) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found...');

    const { QT, TH, GK, CK, TK, status, subjectCode, subjectName, credit, semester } = createScoreDto;

    const isNotExits = await this.isSubjectCodeNotExits(subjectCode, subjectName, credit, semester);

    const updateData: any = { status, subjectName, credit, semester };
    if (QT !== undefined && !isNaN(QT)) updateData.QT = QT;
    if (TH !== undefined && !isNaN(TH)) updateData.TH = TH;
    if (GK !== undefined && !isNaN(GK)) updateData.GK = GK;
    if (CK !== undefined && !isNaN(CK)) updateData.CK = CK;
    if (TK !== undefined && !isNaN(TK)) updateData.TK = TK;

    const score = await this.scoreModel.findOneAndUpdate(
      { subjectCode, idStudent: userId },
      updateData,
      { upsert: true, new: true },
    );

    if (isNotExits)
      return {
        message: 'New score had been added',
        score: score,
        subject: isNotExits,
      };

    return score;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const score = await this.scoreModel.find().skip(skip).limit(limit);
    const total = await this.scoreModel.countDocuments();

    return {
      score,
      totalRecords: total,
      totalPages: Math.ceil(total / limit),
    };
  }

  // async findAllScoreOfUsers(paginationDto: PaginationDto) {
  //   const { page = 1, limit = 10 } = paginationDto;
  //   const skip = (page - 1) * limit;

  //   const user = await this.userModel.find().skip(skip).limit(limit);
  //   const total = await this.scoreModel.countDocuments();

  //   const usersScore = [];

  //   for (let i = 0; i < limit; i++) {
  //     const scores = await this.scoreModel.find({ idStudent: user[i]._id });
  //   }
  // }

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

  async uploadAllScore(userId: string, body: any, currentSubjects: any[] = []) {
    // Log dữ liệu đầu vào để debug
    console.log('--- [uploadAllScore] ---');
    console.log('userId:', userId);
    console.log('body:', JSON.stringify(body, null, 2));
    console.log('currentSubjects:', JSON.stringify(currentSubjects, null, 2));
    // Lưu điểm từ file HTML
    if (body && body.semesters) {
      for (const [semester, semDataRaw] of Object.entries(body.semesters)) {
        const semData = semDataRaw as { subjects?: any[] };
        if (!semData || !Array.isArray(semData.subjects)) continue;
        for (const subjRaw of semData.subjects) {
          const subj = subjRaw as any;
          const parseScore = (val: any) => (val !== undefined && val !== null && val !== '' && val !== '&nbsp;' && !isNaN(Number(val))) ? Number(val) : undefined;
          const credit = parseScore(subj.credit);
          if (credit === undefined) continue;
          const tk = subj?.TK;
          const tkNum = parseScore(tk);
          const scoreData: any = {
            subjectCode: subj.subjectCode,
            subjectName: subj.subjectName,
            credit,
            semester,
            status: (typeof tk === 'string' && tk === 'Miễn') ? 'Miễn'
                  : (tkNum !== undefined && tkNum >= 5) ? 'Hoàn thành'
                  : (tkNum !== undefined && tkNum < 5) ? 'Rớt'
                  : 'Đang học',
            type: 'Học phần chính',
          };
          ['QT', 'GK', 'TH', 'CK'].forEach(key => {
            const val = parseScore(subj[key]);
            if (val !== undefined && !isNaN(val)) scoreData[key] = val;
          });
          if (tkNum !== undefined && !isNaN(tkNum)) scoreData.TK = tkNum;
          await this.create(scoreData, userId);
        }
      }
    }
    // Lưu các môn đang học từ ICS (nếu có)
    if (Array.isArray(currentSubjects)) {
      for (const subjRaw of currentSubjects) {
        if (!subjRaw || typeof subjRaw !== 'object') continue;
        const subj = subjRaw as any;
        const parseScore = (val: any) => (val !== undefined && val !== null && val !== '' && val !== '&nbsp;' && !isNaN(Number(val))) ? Number(val) : undefined;
        const credit = parseScore(subj.credits || subj.credit);
        if (credit === undefined) continue;
        const scoreData: any = {
          subjectCode: subj.code || subj.subjectCode,
          subjectName: subj.subjectName || subj.name,
          credit,
          semester: subj.semester || 'Học kỳ mới nhất',
          status: 'Đang học',
          type: 'Học phần chính',
        };
        ['QT', 'GK', 'TH', 'CK', 'TK'].forEach(key => {
          const val = parseScore(subj[key]);
          if (val !== undefined && !isNaN(val)) scoreData[key] = val;
        });
        await this.create(scoreData, userId);
      }
    }
    return { message: 'Upload all scores success' };
  }
}
