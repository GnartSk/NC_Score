import { PartialType } from '@nestjs/mapped-types';
import { CreateRelateDto } from './create-relate.dto';

export class UpdateRelateDto extends PartialType(CreateRelateDto) {}
