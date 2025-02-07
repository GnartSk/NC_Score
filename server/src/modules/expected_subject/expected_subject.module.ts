import { Module } from '@nestjs/common';
import { ExpectedSubjectService } from './expected_subject.service';
import { ExpectedSubjectController } from './expected_subject.controller';

@Module({
  controllers: [ExpectedSubjectController],
  providers: [ExpectedSubjectService],
})
export class ExpectedSubjectModule {}
