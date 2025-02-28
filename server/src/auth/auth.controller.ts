import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, Put, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { Public } from '@/decorator/customize';
import { CreateAuthDto } from './dto/create-auth.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ChangePasswrodDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  handleLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @Public()
  register(@Body() registerDto: CreateAuthDto) {
    return this.authService.handleRegister(registerDto);
  }

  @Post('verify-code')
  @Public()
  verifyCode(@Query() query: any) {
    return this.authService.verifyCode(query.codeId);
  }

  @Put('change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswrodDto, @Req() req) {
    return this.authService.changePassword(req.user._id, changePasswordDto.oldPassword, changePasswordDto.newPassword);
  }

  @Post('forgot-password')
  @Public()
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.gmail);
  }

  @Get('mail')
  @Public()
  testMail() {
    this.mailerService
      .sendMail({
        to: '22521511@gm.uit.edu.vn', // list of receivers
        subject: 'From NC Score with luv ✔', // Subject line
        text: 'welcome', // plaintext body
        template: 'register',
        context: {
          name: 'Vu trai dep',
          activationCode: 123456789,
        },
      })
      .then(() => {})
      .catch(() => {});
    return 'ok';
  }
}
