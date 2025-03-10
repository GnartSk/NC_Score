import { IsEnum, IsNotEmpty, IsOptional, Matches } from 'class-validator';

export class CreateScoreDto {
  @IsOptional()
  QT: number;

  @IsOptional()
  TH: number;

  @IsOptional()
  GK: number;

  @IsOptional()
  CK: number;

  @IsOptional()
  TK: number;

  @IsNotEmpty({ message: 'status is required' })
  @IsEnum(['ONSTUDY', 'NOTSTUDY', 'FINISH'], {
    message: 'status must be a in the value: ONSTUDY, NOTSTUDY, FINISH',
  })
  status: string; //"ONSTUDY", "NOTSTUDY", "FINISH"

  @IsNotEmpty({ message: 'subjectCode is required' })
  @Matches(/^[A-Z]{2}\d{3}$/, {
    message: 'subjectCode must have first 2 uppercase letters and last 3 numbers (eg: NT101)',
  })
  subjectCode: string;

  @IsNotEmpty({ message: 'subjectName is required' })
  subjectName: string;

  @IsNotEmpty({ message: 'credit is required' }) // tín chỉ
  credit: number;
}
