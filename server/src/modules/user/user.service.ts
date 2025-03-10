import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { hashPasswordHelper } from '@/helpers/util';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { CreateAuthDto } from '@/auth/dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly mailerService: MailerService,
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
      user,
    };
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (+current - 1) * +pageSize;

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

  async findByGmail(gmail: string) {
    return await this.userModel.findOne({ gmail });
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne({ _id: updateUserDto._id }, { ...updateUserDto });
  }

  async remove(_id: string) {
    if (mongoose.isValidObjectId(_id)) {
      return this.userModel.deleteOne({ _id });
    } else {
      throw new BadRequestException('Invalid MongoDB _id');
    }
  }

  async handleRegister(registerDto: CreateAuthDto) {
    const { gmail, username, password, fullName, studentId, academicYear, role, specialized } = registerDto;

    const isExist = await this.isEmailExist(gmail);
    if (isExist) {
      throw new BadRequestException('Gmail has been used.');
    }

    const hashPassword = await hashPasswordHelper(password);
    const codeId = uuidv4();
    const user = await this.userModel.create({
      gmail,
      username,
      fullName,
      password: hashPassword,
      isActive: false,
      codeId: codeId,
      codeExpired: dayjs().add(100, 'minutes'),
      studentId,
      academicYear,
      role,
      specialized,
    });

    this.mailerService.sendMail({
      to: user.gmail, // list of receivers
      subject: 'Activate your NC Score account', // Subject line
      template: 'register',
      context: {
        name: user?.fullName ?? user.gmail,
        activationCode: codeId,
      },
      attachments: [
        {
          filename: 'LogoUIT.png',
          path: process.cwd() + '/src/mail/assets/LogoUIT.png', 
          cid: 'logo',
        },
      ],
    });

    return {
      user,
    };
  }

  async handleActiveAccount(codeId: string) {
    if (!codeId) {
      throw new BadRequestException('Invalid activation code.');
    }

    const user = await this.userModel.findOne({ codeId: codeId });

    if (!user) {
      throw new BadRequestException('Invalid or expired activation code.');
    }

    if (dayjs().isAfter(user.codeExpired)) {
      throw new BadRequestException('Activation code has expired.');
    }

    user.isActive = true;
    user.codeId = null;
    user.codeExpired = null;
    await user.save();

    return true;
  }
}
