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
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

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
    AuthModule,
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
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          secure:true,
          // ignoreTLS: true,
          // secure: false,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: '"No Reply" <no-reply@localhost>',
        },
        // preview: true,
        // template: {
        //   dir: process.cwd() + '/template/',
        //   adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        //   options: {
        //     strict: true,
        //   },
        // },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
