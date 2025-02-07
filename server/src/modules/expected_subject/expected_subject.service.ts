import { Injectable } from '@nestjs/common';
import { CreateExpectedSubjectDto } from './dto/create-expected_subject.dto';
import { UpdateExpectedSubjectDto } from './dto/update-expected_subject.dto';

@Injectable()
export class ExpectedSubjectService {
  create(createExpectedSubjectDto: CreateExpectedSubjectDto) {
    return 'This action adds a new expectedSubject';
  }

  findAll() {
    return `This action returns all expectedSubject`;
  }

  findOne(id: number) {
    return `This action returns a #${id} expectedSubject`;
  }

  update(id: number, updateExpectedSubjectDto: UpdateExpectedSubjectDto) {
    return `This action updates a #${id} expectedSubject`;
  }

  remove(id: number) {
    return `This action removes a #${id} expectedSubject`;
  }
}
