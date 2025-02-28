import { Module } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';
import { AuthController } from '@/auth/auth.controller';
import { AuthService } from '@/auth/auth.service';
import { JwtStrategy } from '@/auth/passport/jwt.strategy';
import { LocalStrategy } from '@/auth/passport/local.strategy';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Subject, SubjectSchema } from './schemas/subject.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Subject.name, schema: SubjectSchema }]), UserModule],
  controllers: [SubjectController, AuthController],
  providers: [SubjectService, AuthService, JwtStrategy, LocalStrategy],
})
export class SubjectModule {}
