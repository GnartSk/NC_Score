import { PartialType } from '@nestjs/mapped-types';
import { CreateExpectedSubjectDto } from './create-expected_subject.dto';

export class UpdateExpectedSubjectDto extends PartialType(CreateExpectedSubjectDto) {}
