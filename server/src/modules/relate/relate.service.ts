import { Injectable } from '@nestjs/common';
import { CreateRelateDto } from './dto/create-relate.dto';
import { UpdateRelateDto } from './dto/update-relate.dto';

@Injectable()
export class RelateService {
  create(createRelateDto: CreateRelateDto) {
    return 'This action adds a new relate';
  }

  findAll() {
    return `This action returns all relate`;
  }

  findOne(id: number) {
    return `This action returns a #${id} relate`;
  }

  update(id: number, updateRelateDto: UpdateRelateDto) {
    return `This action updates a #${id} relate`;
  }

  remove(id: number) {
    return `This action removes a #${id} relate`;
  }
}
