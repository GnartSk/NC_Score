import { Module } from '@nestjs/common';
import { ScoreService } from './score.service';
import { ScoreController } from './score.controller';
import { AuthService } from '@/auth/auth.service';
import { JwtStrategy } from '@/auth/passport/jwt.strategy';
import { LocalStrategy } from '@/auth/passport/local.strategy';
import { AuthController } from '@/auth/auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SubjectSchema } from '../subject/schemas/subject.schema';
import { UserModule } from '../user/user.module';
import { Score } from './schemas/score.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Score.name, schema: SubjectSchema }]), UserModule],
  controllers: [ScoreController, AuthController],
  providers: [ScoreService, AuthService, JwtStrategy, LocalStrategy],
})
export class ScoreModule {}
