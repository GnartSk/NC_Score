import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import { comparePasswordHelper } from '@/helpers/util';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private jwtService: JwtService,
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
}
