import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty({ message: 'gmail is required' })
  gmail: string;

  @IsNotEmpty({ message: 'username is required' })
  username: string;

  @IsNotEmpty({ message: 'fullName is required' })
  fullName: string;

  @IsNotEmpty({ message: 'password is required' })
  password: string;

  @IsNotEmpty({ message: 'studentId is required' })
  studentId: string;

  @IsNotEmpty({ message: 'academicYear is required' })
  academicYear: string;

  @IsOptional()
  specialized: string; // 'Mạng máy tính & Truyền thông dữ liệu' 'An toàn thông tin'

  @IsOptional()
  avatar: string;

  @IsOptional()
  birth: string;

  @IsOptional()
  gender: string;

  @IsNotEmpty({ message: 'role is required' })
  role: string;   //  "ADMIN", "USER"
}
