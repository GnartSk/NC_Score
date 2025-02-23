import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import { comparePasswordHelper } from '@/helpers/util';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async signIn(gmail: string, pass: string): Promise<any> {
    const user = await this.userService.findByGmail(gmail);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isValidPassword = await comparePasswordHelper(pass, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user._id, gmail: user.gmail };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
