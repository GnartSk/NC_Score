import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSubjectDto {
  @IsNotEmpty({ message: 'subjectCode is required' })
  subjectCode: string;

  @IsNotEmpty({ message: 'subjectName is required' })
  subjectName: string;

  @IsNotEmpty({ message: 'credit is required' }) // tín chỉ
  credit: number;

  @IsNotEmpty({ message: 'blockOfKnowledge is required' })
  blockOfKnowledge: string;

  @IsNotEmpty({ message: 'specialized is required' })
  specialized: string;  // 'Mạng máy tính & Truyền thông dữ liệu' 'An toàn thông tin'

  @IsOptional()
  @IsArray()
  @IsString({ each: true }) // Mỗi phần tử trong mảng phải là chuỗi
  relatedToIndustry: string[];
}
