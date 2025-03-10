import { IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  username: string;

  @IsOptional()
  fullName: string;

  @IsOptional()
  avatar: string;

  @IsOptional()
  birth: string;

  @IsOptional()
  gender: string;

  @IsOptional()
  studentId: number;

  @IsOptional()
  academicYear: number;

  @IsOptional()
  specialized: string;
}
