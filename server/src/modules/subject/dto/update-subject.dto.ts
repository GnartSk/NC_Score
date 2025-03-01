import { PartialType } from '@nestjs/mapped-types';
import { CreateSubjectDto } from './create-subject.dto';
import { IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateSubjectDto extends PartialType(CreateSubjectDto) {
  @IsOptional()
  subjectCode: string;

  @IsOptional()
  subjectName: string;

  @IsOptional() // tín chỉ
  credit: number;

  @IsOptional()
  blockOfKnowledge: string;

  @IsOptional()
  specialized: string; // 'Mạng máy tính & Truyền thông dữ liệu' 'An toàn thông tin'

  @IsOptional()
  @IsArray()
  @IsString({ each: true }) // Mỗi phần tử trong mảng phải là chuỗi
  relatedToIndustry: string[];
}
