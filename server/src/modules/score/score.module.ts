import { Module } from '@nestjs/common';
import { ScoreService } from './score.service';
import { ScoreController } from './score.controller';
import { AuthService } from '@/auth/auth.service';
import { JwtStrategy } from '@/auth/passport/jwt.strategy';
import { LocalStrategy } from '@/auth/passport/local.strategy';
import { AuthController } from '@/auth/auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { Score, ScoreSchema } from './schemas/score.schema';
import { SubjectModule } from '../subject/subject.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Score.name, schema: ScoreSchema }]), UserModule, SubjectModule],
  controllers: [ScoreController, AuthController],
  providers: [ScoreService, AuthService, JwtStrategy, LocalStrategy],
})
export class ScoreModule {}
