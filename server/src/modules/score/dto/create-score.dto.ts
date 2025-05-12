import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, Matches } from 'class-validator';

export class CreateScoreDto {
  @IsOptional()
  @IsNumber({}, { message: 'QT must be a number' })
  @Type(() => Number)
  QT: number;

  @IsOptional()
  @IsNumber({}, { message: 'TH must be a number' })
  @Type(() => Number)
  TH: number;

  @IsOptional()
  @IsNumber({}, { message: 'GK must be a number' })
  @Type(() => Number)
  GK: number;

  @IsOptional()
  @IsNumber({}, { message: 'CK must be a number' })
  @Type(() => Number)
  CK: number;

  @IsOptional()
  @Matches(/^\d+(\.\d+)?$|^Miễn$/, {
    message: 'TK must be a number or "Miễn"',
  })
  TK: number;

  @IsNotEmpty({ message: 'status is required' })
  @IsEnum(['ONSTUDY', 'NOTSTUDY', 'FINISH'], {
    message: 'status must be a in the value: ONSTUDY, NOTSTUDY, FINISH',
  })
  status: string; //"ONSTUDY", "NOTSTUDY", "FINISH"

  @IsNotEmpty({ message: 'type is required' })
  @IsEnum(['Học lại', 'Miễn', 'Học phần chính'], {
    message: 'status must be a in the value: Học lại, Miễn, Học phần chính',
  })
  type: string; //"Học lại", "Miễn", "Học phần chính"

  @IsNotEmpty({ message: 'subjectCode is required' })
  @Matches(/^[A-Z]{2}\d{3}$/, {
    message: 'subjectCode must have first 2 uppercase letters and last 3 numbers (eg: NT101)',
  })
  subjectCode: string;

  @IsNotEmpty({ message: 'subjectName is required' })
  subjectName: string;

  @IsNotEmpty({ message: 'credit is required' }) // tín chỉ
  credit: number;

  @IsNotEmpty({ message: 'semester is required' })
  semester: string; // 'I', 'II', 'III',..., 'VIII'
}
