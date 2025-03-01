import { Injectable } from '@nestjs/common';
import { CreateScoreDto } from './dto/create-score.dto';
import { UpdateScoreDto } from './dto/update-score.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Score } from './schemas/score.schema';
import { User } from '../user/schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class ScoreService {
  constructor(
    @InjectModel(Score.name)
    private scoreModel: Model<Score>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}
  create(createScoreDto: CreateScoreDto) {
    return 'This action adds a new score';
  }

  findAll() {
    return `This action returns all score`;
  }

  findOne(id: number) {
    return `This action returns a #${id} score`;
  }

  update(id: number, updateScoreDto: UpdateScoreDto) {
    return `This action updates a #${id} score`;
  }

  remove(id: number) {
    return `This action removes a #${id} score`;
  }
}
