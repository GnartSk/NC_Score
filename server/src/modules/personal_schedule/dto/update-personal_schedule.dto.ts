import { PartialType } from '@nestjs/mapped-types';
import { CreatePersonalScheduleDto } from './create-personal_schedule.dto';

export class UpdatePersonalScheduleDto extends PartialType(CreatePersonalScheduleDto) {}
