import { IsNotEmpty } from 'class-validator';

export class CreateSubjectDto {
  @IsNotEmpty({ message: 'subjectCode is required' })
  subjectCode: string;

  @IsNotEmpty({ message: 'subjectName is required' })
  subjectName: string;

  @IsNotEmpty({ message: 'credit is required' }) // tín chỉ
  credit: string;

  @IsNotEmpty({ message: 'blockOfKnowledge is required' })
  blockOfKnowledge: string;

  @IsNotEmpty({ message: 'specialized is required' })
  specialized: string;
}
