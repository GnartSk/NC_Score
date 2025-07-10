import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { Public } from '@/decorator/customize';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ChangePasswrodDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import { UseFilters } from '@nestjs/common';
import { UnauthorizedRedirectFilter } from './passport/unauthorized-exception.filter';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

  @Get('google/login')
  @Public()
  @UseGuards(GoogleAuthGuard)
  googleLogin() {}

  @Get('google/callback')
  @Public()
  @UseGuards(GoogleAuthGuard)
  @UseFilters(UnauthorizedRedirectFilter)
  async googleCallback(@Req() req, @Res() res) {
    console.log(req);
    if (!req.user) {
      console.log('Google authentication failed, redirecting to login...');
      return res.redirect(process.env.NODE_ENV === 'production' 
      ? 'https://your-vercel-domain.vercel.app/auth/login'
      : 'http://localhost:3000/auth/login');
    }
    const redirectUrl = process.env.NODE_ENV === 'production'
      ? `https://your-vercel-domain.vercel.app/auth?token=${req.user.access_token}`
      : `http://localhost:3000/auth?token=${req.user.access_token}`;
    console.log(`Redirecting to: ${redirectUrl}`);
    res.redirect(redirectUrl);
  }
}
