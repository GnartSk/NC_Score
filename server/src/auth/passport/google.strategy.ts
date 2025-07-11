import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallBack } from 'passport-google-oauth20';
import googleOauthConfig from '../config/google-oauth.config';
import { ConfigType } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(googleOauthConfig.KEY) private googleConfiguration: ConfigType<typeof googleOauthConfig>,
    private authService: AuthService,
  ) {
    super({
      clientID: googleConfiguration.clientId,
      clientSecret: googleConfiguration.clientSecret,
      callbackURL: googleConfiguration.callbackURL,
      scope: ['email', 'profile'],
      prompt: 'select_account',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallBack) {
    // console.log({ profile });
    try {
      const email = profile.emails[0].value; // Lấy email từ profile
      const username = email.split('@')[0]; // Lấy phần trước '@'

      const emailRegex = /^[0-9]{2}52[0-9]{4}@gm\.uit\.edu\.vn$/;
      if (!emailRegex.test(email)) {
        return done(null, false);
      }

      const user = await this.authService.validateGoogleUser({
        gmail: email,
        username: profile.displayName && profile.displayName.trim() !== '' ? profile.displayName : username,
        fullName: `${profile.name?.familyName} ${profile.name?.givenName}`,
        password: '',
        studentId: username,
        academicYear: `20${username.substring(0, 2)}`,
        role: 'USER',
        specialized: '',
        avatar: profile.photos?.[0]?.value || '',
        birth: '',
        gender: '',
      });
      done(null, user);
    } catch (error) {
      console.log('Google Auth Error:', error.message);
      return done(null, false);
    }
  }
}
