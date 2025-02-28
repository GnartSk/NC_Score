import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';

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

  @IsNotEmpty({ message: 'specialized is required' })
  specialized: string; // 'Mạng máy tính & Truyền thông dữ liệu' 'An toàn thông tin'

  @Prop()
  avatar: string;

  @Prop()
  birth: string;

  @Prop()
  gender: string;

  @Prop()
  role: string;
}
