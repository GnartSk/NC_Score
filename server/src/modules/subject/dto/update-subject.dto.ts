import { PartialType } from '@nestjs/mapped-types';
import { CreateSubjectDto } from './create-subject.dto';
import { IsArray, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateSubjectDto extends PartialType(CreateSubjectDto) {
  @IsOptional()
  @Matches(/^[A-Z]{2}\d{3}$/, {
    message: 'subjectCode must have first 2 uppercase letters and last 3 numbers (eg: NT101)',
  })
  subjectCode: string;

  @IsOptional()
  subjectName: string;

  @IsOptional() // tín chỉ
  credit: number;

  @IsNotEmpty({ message: 'blockOfKnowledge is required' })
  @IsEnum([
    'Các môn lý luận chính trị',
    'Toán – Tin học – Khoa học tự nhiên',
    'Ngoại ngữ',
    'Cơ sở ngành',
    'Chuyên ngành',
    'Thực tập doanh nghiệp',
    'Đồ án',
    'Khóa luận tốt nghiệp',
    'Chuyên đề tốt nghiệp',
  ])
  blockOfKnowledge: string;

  @IsNotEmpty({ message: 'specialized is required' })
  @IsEnum(['MMTT', 'ATTT', 'Tự chọn'], {
    message: 'specialized must be a in the value: MMTT, ATTT',
  })
  specialized: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true }) // Mỗi phần tử trong mảng phải là chuỗi
  relatedToIndustry: string[];
}
