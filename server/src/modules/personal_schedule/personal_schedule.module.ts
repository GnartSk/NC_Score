import { Module } from '@nestjs/common';
import { PersonalScheduleService } from './personal_schedule.service';
import { PersonalScheduleController } from './personal_schedule.controller';

@Module({
  controllers: [PersonalScheduleController],
  providers: [PersonalScheduleService],
})
export class PersonalScheduleModule {}
