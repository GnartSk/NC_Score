import { Module } from '@nestjs/common';
import { ReaderService } from './reader.service';
import { ReaderController } from './reader.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { AuthController } from '@/auth/auth.controller';
import { JwtStrategy } from '@/auth/passport/jwt.strategy';
import { AuthService } from '@/auth/auth.service';
import { LocalStrategy } from '@/auth/passport/local.strategy';
import { SubjectSchema } from '../subject/schemas/subject.schema';

@Module({
  imports: [UserModule, MongooseModule.forFeature([{ name: 'Subject', schema: SubjectSchema }])],
  controllers: [ReaderController, AuthController],
  providers: [ReaderService, AuthService, JwtStrategy, LocalStrategy],
})
export class ReaderModule {}
