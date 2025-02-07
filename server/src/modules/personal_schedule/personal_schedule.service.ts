import { Injectable } from '@nestjs/common';
import { CreatePersonalScheduleDto } from './dto/create-personal_schedule.dto';
import { UpdatePersonalScheduleDto } from './dto/update-personal_schedule.dto';

@Injectable()
export class PersonalScheduleService {
  create(createPersonalScheduleDto: CreatePersonalScheduleDto) {
    return 'This action adds a new personalSchedule';
  }

  findAll() {
    return `This action returns all personalSchedule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} personalSchedule`;
  }

  update(id: number, updatePersonalScheduleDto: UpdatePersonalScheduleDto) {
    return `This action updates a #${id} personalSchedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} personalSchedule`;
  }
}
