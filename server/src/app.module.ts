import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AcademicYearModule } from './modules/academic_year/academic_year.module';
import { CommentModule } from './modules/comment/comment.module';
import { ExpectedSubjectModule } from './modules/expected_subject/expected_subject.module';
import { PersonalScheduleModule } from './modules/personal_schedule/personal_schedule.module';
import { PostModule } from './modules/post/post.module';
import { RelateModule } from './modules/relate/relate.module';
import { ReportModule } from './modules/report/report.module';
import { ScheduleModule } from './modules/schedule/schedule.module';
import { ScoreModule } from './modules/score/score.module';
import { SubjectModule } from './modules/subject/subject.module';
import { SubjectRelateModule } from './modules/subject_relate/subject_relate.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from '@/auth/auth.module';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    AcademicYearModule,
    CommentModule,
    ExpectedSubjectModule,
    PersonalScheduleModule,
    PostModule,
    RelateModule,
    ReportModule,
    ScheduleModule,
    ScoreModule,
    SubjectModule,
    SubjectRelateModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
