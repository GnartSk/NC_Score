import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class CourseSelectionDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['K17', 'K18', 'K19'])
  course: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['An toàn thông tin', 'Mạng máy tính & Truyền thông dữ liệu'])
  major: string;
} 