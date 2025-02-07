import { Injectable } from '@nestjs/common';
import { CreateSubjectRelateDto } from './dto/create-subject_relate.dto';
import { UpdateSubjectRelateDto } from './dto/update-subject_relate.dto';

@Injectable()
export class SubjectRelateService {
  create(createSubjectRelateDto: CreateSubjectRelateDto) {
    return 'This action adds a new subjectRelate';
  }

  findAll() {
    return `This action returns all subjectRelate`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subjectRelate`;
  }

  update(id: number, updateSubjectRelateDto: UpdateSubjectRelateDto) {
    return `This action updates a #${id} subjectRelate`;
  }

  remove(id: number) {
    return `This action removes a #${id} subjectRelate`;
  }
}
