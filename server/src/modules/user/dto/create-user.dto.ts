import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
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
  specialized: string;

  @IsOptional()
  avatar: string;

  @IsOptional()
  birth: string;

  @IsOptional()
  gender: string;

  @IsNotEmpty({ message: 'role is required' })
  role: string; //  "ADMIN", "USER"
}
