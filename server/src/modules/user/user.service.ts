import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { hashPasswordHelper } from '@/helpers/util';
import aqp from 'api-query-params';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>
  ) {}

  isEmailExist = async (gmail: string) => {
    const user = await this.userModel.exists({ gmail });
    if (user) return true;
    return false;
  };

  async create(createUserDto: CreateUserDto) {
    const { gmail, username, fullName, password, avatar, birth, gender } = createUserDto;

    const isExist = await this.isEmailExist(gmail);
    if (isExist) {
      throw new BadRequestException('Gmail has been used.');
    }

    const hashPassword = await hashPasswordHelper(password);
    const user = await this.userModel.create({
      gmail,
      username,
      fullName,
      password: hashPassword,
      avatar,
      birth,
      gender,
    });

    return {
      _id: user._id,
    };
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (+current - 1) * (+pageSize);

    const results = await this.userModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .sort(sort as any);
    return results;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
