import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import { comparePasswordHelper, getFrontendUri } from '@/helpers/util';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { User } from '@/modules/user/schemas/user.schema';
import { Model } from 'mongoose';
import bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateUserDto } from '@/modules/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async validateUser(gmail: string, pass: string): Promise<any> {
    const user = await this.userService.findByGmail(gmail);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isValidPassword = await comparePasswordHelper(pass, user.password);

    if (!user || !isValidPassword) return null;

    return user;
  }

  async login(user: any) {
    const payload = { username: user.gmail, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  handleRegister = async (registerDto: CreateAuthDto) => {
    return await this.userService.handleRegister(registerDto);
  };

  async verifyCode(codeId: string): Promise<boolean> {
    return await this.userService.handleActiveAccount(codeId);
  }

  async changePassword(userId, oldPassword: string, newPassword: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found...');
    }

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Wrong credentials');
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = newHashedPassword;
    await user.save();
  }

  async forgotPassword(gmail: string) {
    const user = await this.userModel.findOne({ gmail });

    if (user) {
      const payload = { username: user?.gmail, sub: user?._id };
      const token = this.jwtService.sign(payload);

      this.mailerService.sendMail({
        to: user.gmail, // list of receivers
        subject: 'Password Reset Request', // Subject line
        template: 'forgot_password',
        context: {
          name: user.fullName,
          resetLink: `${getFrontendUri()}/reset-password?token=${token}`,
        },
      });

      return 'Email sended';
    }

    throw new NotFoundException('Gmail not found...');
  }

  async validateGoogleUser(googleUser: CreateUserDto) {
    const user = await this.userService.findByGmail(googleUser.gmail);

    if (user) {
      const payload = { username: user.gmail, sub: user._id };

      return {
        user: user,
        access_token: this.jwtService.sign(payload),
      };
    }

    return await this.userModel.create(googleUser);
  }
}
