import { IsString, IsNumber, IsOptional, ValidateNested, IsArray, IsObject, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class SubjectDTO {
    @IsString()
    @IsNotEmpty()
    subjectCode: string;
  
    @IsString()
    @IsNotEmpty()
    subjectName: string;
  
    @IsNumber()
    credit: number;
  
    @IsNumber()
    @IsOptional()
    QT?: number;
  
    @IsNumber()
    @IsOptional()
    GK?: number;
  
    @IsNumber()
    @IsOptional()
    TH?: number;
  
    @IsNumber()
    @IsOptional()
    CK?: number;
  
    @IsNotEmpty()
    TK: string | number;
  }

export class SemesterDTO {
  @ValidateNested({ each: true })
  @Type(() => SubjectDTO)
  subjects: SubjectDTO[];

  
}

export class StudentGradesDTO {
  @IsObject()
  @ValidateNested()
  semesters: Record<string, SemesterDTO>;
}
