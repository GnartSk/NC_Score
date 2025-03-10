import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { hashPasswordHelper } from '@/helpers/util';
import mongoose from 'mongoose';
import { CreateAuthDto } from '@/auth/dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';
import { PaginationDto } from './dto/pagination.dto';

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

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const users = await this.userModel.find().skip(skip).limit(limit);
    const total = await this.userModel.countDocuments();

    return {
      users,
      totalRecords: total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(_id: string) {
    return await this.userModel.findOne({ _id });
  }

  async findByGmail(gmail: string) {
    return await this.userModel.findOne({ gmail });
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateUserDto);

    await user.save();
    return user;
  }

  async remove(_id: string) {
    if (mongoose.isValidObjectId(_id)) {
      return this.userModel.deleteOne({ _id });
    } else {
      throw new BadRequestException('Invalid MongoDB _id');
    }
  }

  async handleRegister(registerDto: CreateAuthDto) {
    const { gmail, username, password, fullName, studentId, academicYear, role } = registerDto;

    const gmailRegex = /^[0-9]{2}52[0-9]{4}@gm\.uit\.edu\.vn$/;
    if (!gmailRegex.test(gmail)) {
      throw new UnauthorizedException('Invalid gmail format');
    }

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
