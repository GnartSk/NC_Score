import { PartialType } from '@nestjs/mapped-types';
import { CreateSubjectRelateDto } from './create-subject_relate.dto';

export class UpdateSubjectRelateDto extends PartialType(CreateSubjectRelateDto) {}
